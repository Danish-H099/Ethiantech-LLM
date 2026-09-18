import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { m as Motion, useReducedMotion } from "motion/react";
import { Clock, CheckCircle2, TrendingUp, RotateCcw, AlertTriangle, Eye, AlertCircle, ListCheck, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getQuizData,
  getQuizAttempts,
  getQuizDraftAnswers,
  saveQuizDraftAnswers,
  clearQuizDraftAnswers,
  submitQuizAttempt,
  hasRemainingAttempts,
} from "src/services/studentRepository";
import { createReveal } from "src/lib/animationVariants";
import { DEFAULT_STUDENT_ID } from "src/data/students";
import LessonCompleteButton from "src/components/student/LessonCompleteButton";
import LessonPlayerPlaceholder from "src/components/student/LessonPlayerPlaceholder";
import ConfirmDialog from "src/components/ui/ConfirmDialog";

const MODE_INTRO = "intro";
const MODE_ACTIVE = "active";
const MODE_REVIEW = "review";
const MODE_RESULTS = "results";

// ----------------------------------------------------------- quiz helpers

function deriveInitialState(courseId, lessonId, spec, questions, isCompleted) {
  if (!spec || !spec.questions || spec.questions.length === 0) {
    return {
      mode: MODE_INTRO,
      result: null,
      answers: {},
      currentQuestion: 0,
    };
  }
  const attempts = getQuizAttempts(DEFAULT_STUDENT_ID, courseId, lessonId) || [];
  const draft = getQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId);
  const passedAttempts = attempts.filter((a) => a.score >= spec.passingScore);
  const hasPassed = passedAttempts.length > 0;
  const remaining = hasRemainingAttempts(DEFAULT_STUDENT_ID, courseId, lessonId);

  if (hasPassed) {
    const latest = passedAttempts[passedAttempts.length - 1];
    return {
      mode: MODE_RESULTS,
      result: { attempt: latest, passed: true, nextLessonId: null, courseCompleted: true },
      answers: {},
      currentQuestion: 0,
    };
  }
  if (attempts.length > 0 && !remaining && !isCompleted) {
    const latest = attempts[attempts.length - 1];
    return {
      mode: MODE_RESULTS,
      result: { attempt: latest, passed: false, nextLessonId: null, courseCompleted: false },
      answers: {},
      currentQuestion: 0,
    };
  }

  const initialAnswers = draft ? { ...draft } : {};
  return {
    mode: MODE_INTRO,
    result: null,
    answers: initialAnswers,
    currentQuestion: firstUnansweredIndex(questions, initialAnswers),
  };
}

function countAnswered(questions, answers) {
  return questions.filter((q) => {
    const v = answers[q.id];
    if (v === undefined || v === null) return false;
    if (q.type === "multiple") return Array.isArray(v) && v.length > 0;
    return typeof v === "string" && v.length > 0;
  }).length;
}

function buildAnsweredSet(questions, answers) {
  const set = new Set();
  questions.forEach((q, i) => {
    const v = answers[q.id];
    if (v === undefined || v === null) return;
    if (q.type === "multiple") {
      if (Array.isArray(v) && v.length > 0) set.add(String(i));
    } else if (typeof v === "string" && v.length > 0) {
      set.add(String(i));
    }
  });
  return set;
}

function firstUnansweredIndex(questions, answers) {
  const idx = questions.findIndex((q) => {
    const v = answers[q.id];
    if (v === undefined || v === null) return true;
    if (q.type === "multiple") return !(Array.isArray(v) && v.length > 0);
    return typeof v !== "string" || v.length === 0;
  });
  return idx === -1 ? 0 : idx;
}

function hasUnsavedAnswers(answers) {
  return answers && Object.keys(answers).length > 0;
}

// ----------------------------------------------------------- intro screen

function QuizIntroScreen({
  spec,
  title,
  duration,
  attempts,
  bestScore,
  remainingAttempts,
  maxAttempts,
  hasDraft,
  isPassed,
  nextLessonId,
  onStart,
  onResume,
  onRetry,
  onReview,
  onNextLesson,
  onMarkComplete,
  isCompleted,
  isOverrideComplete,
}) {
  const totalQuestions = spec.questions.length;
  const attemptCount = attempts.length;

  function attemptLabel(i) {
    const a = attempts[i];
    const passed = a.score >= spec.passingScore;
    const when = new Date(a.submittedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return `${passed ? "Passed" : "Failed"} — ${a.score}% (${a.correctCount}/${a.totalCount}) · ${when}`;
  }

  return (
    <div className="card p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-heading font-semibold text-ink">{title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm-fluid text-ink-muted">
          {totalQuestions > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span className="text-sm-fluid font-bold">{totalQuestions}</span>
              </span>
              {totalQuestions} question{totalQuestions === 1 ? "" : "s"}
            </span>
          )}
          {duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              {duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp size={14} aria-hidden="true" />
            Passing score: {spec.passingScore}%
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RotateCcw size={14} aria-hidden="true" />
            {maxAttempts === null
              ? "Unlimited attempts"
              : `${attemptCount} of ${maxAttempts} attempt${maxAttempts === 1 ? "" : "s"} used`}
          </span>
        </div>

        {bestScore !== null && attemptCount > 0 && (
          <p className="mt-3 text-sm-fluid text-ink-muted">
            Your best score: <span className="font-semibold text-ink">{bestScore}%</span>
          </p>
        )}

        {hasDraft && !isPassed && (
          <p className="mt-3 text-sm-fluid text-ink-muted">
            You have saved answers from a previous session — they'll be restored when you resume.
          </p>
        )}

        {isOverrideComplete && (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm-fluid text-amber-800">
              This lesson was marked complete manually (quiz not passed). No score is
              recorded for the override.
            </p>
          </div>
        )}

        {isPassed ? (
          <div className="mt-6 rounded-xl bg-success-soft p-4 text-center">
            <CheckCircle2 size={32} className="mx-auto text-success" aria-hidden="true" />
            <p className="mt-2 text-body-lg font-semibold text-success">
              You passed! {bestScore !== null && `Score: ${bestScore}%`}
            </p>
            <p className="mt-1 text-sm-fluid text-ink-muted">
              {attemptCount === 1
                ? "1 attempt"
                : `${attemptCount} attempts`} · best {bestScore}%
            </p>
          </div>
        ) : attemptCount > 0 ? (
          <div className="mt-6 rounded-xl bg-amber-50 p-4">
            <p className="text-sm-fluid font-medium text-amber-800">
              Previous attempt{attemptCount > 1 ? "s" : ""}:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm-fluid text-amber-800">
              {attempts.map((a, i) => (
                <li key={a.submittedAt} className="flex justify-between">
                  <span>{attemptLabel(i)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-4 max-w-md text-sm-fluid text-ink-muted">
            Once you start, your selections are saved automatically as you move
            between questions. You'll review everything before submitting, and
            each submission creates a new attempt.
          </p>

          {isOverrideComplete ? (
            <LessonCompleteButton isCompleted={isCompleted} onComplete={onMarkComplete} lessonTitle={title} />
          ) : hasDraft && !isPassed ? (
            <button
              type="button"
              onClick={onResume}
              className="btn-brand w-full justify-center gap-2 px-5 py-3 text-sm-fluid sm:w-auto"
            >
              Resume Quiz
            </button>
          ) : isPassed ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReview}
                className="btn-outline px-5 py-2.5 text-sm-fluid"
              >
                Review Answers
              </button>
              {remainingAttempts && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="btn-outline px-5 py-2.5 text-sm-fluid"
                >
                  Retry Quiz
                </button>
              )}
              {nextLessonId && (
                <button
                  type="button"
                  onClick={onNextLesson}
                  className="btn-brand px-5 py-2.5 text-sm-fluid"
                >
                  Continue to next lesson
                </button>
              )}
            </div>
          ) : remainingAttempts ? (
            <button
              type="button"
              onClick={onStart}
              className="btn-brand w-full justify-center gap-2 px-5 py-3 text-sm-fluid sm:w-auto"
            >
              Start Quiz
            </button>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm-fluid text-ink-muted">
                No attempts remaining. You can still mark this lesson complete to
                keep moving forward (this won't record a passing score).
              </p>
              <LessonCompleteButton isCompleted={isCompleted} onComplete={onMarkComplete} lessonTitle={title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------- question card

const OPTION_BASE =
  "relative flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-3 text-left text-sm-fluid text-ink transition-colors sm:py-4";
function QuizQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  value,
  onChange,
  readOnly = false,
  showCorrectness = false,
}) {
  const isMultiple = question.type === "multiple";
  const questionNumber = questionIndex + 1;

  function isOptionChecked(optionId) {
    if (isMultiple) {
      return Array.isArray(value) && value.includes(optionId);
    }
    return value === optionId;
  }

  function isOptionCorrect(optionId) {
    const correct = question.correctAnswer;
    if (isMultiple) {
      return Array.isArray(correct) && correct.includes(optionId);
    }
    return correct === optionId;
  }

  function handleToggle(optionId, checked) {
    if (readOnly) return;
    if (isMultiple) {
      const current = Array.isArray(value) ? value : [];
      const next = checked
        ? [...current, optionId]
        : current.filter((id) => id !== optionId);
      onChange(question.id, next);
    } else {
      onChange(question.id, checked ? optionId : null);
    }
  }

  function optionClassName(optionId) {
    const checked = isOptionChecked(optionId);
    const correct = isOptionCorrect(optionId);
    let cls = OPTION_BASE;

    if (showCorrectness) {
      if (correct) {
        cls += " border-success bg-success-soft";
      } else if (checked) {
        cls += " border-red-500 bg-red-50";
      }
    } else if (checked) {
      cls += " border-brand bg-tint-student";
    } else {
      cls += " border-border hover:border-brand/50 hover:bg-surface-soft";
    }

    if (readOnly) {
      cls += " cursor-default";
    } else {
      cls += " peer-focus-visible:ring peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2";
    }
    return cls;
  }

  return (
    <fieldset className="border-0 p-0" aria-readonly={readOnly || undefined}>
      <legend className="sr-only">
        {`Question ${questionNumber} of ${totalQuestions}`}
      </legend>

      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-sm-fluid font-medium text-ink">{question.text}</p>
        <span
          className="shrink-0 text-sm-fluid font-medium text-ink-muted"
          aria-label={`Question ${questionNumber} of ${totalQuestions}`}
        >
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      <ul className="space-y-3">
        {question.options.map((option) => {
          const checked = isOptionChecked(option.id);
          const correct = isOptionCorrect(option.id);
          const inputId = `${question.id}-${option.id}`;
          return (
            <li key={option.id} className="flex items-center gap-3">
              <input
                id={inputId}
                type={isMultiple ? "checkbox" : "radio"}
                name={readOnly ? undefined : question.id}
                value={option.id}
                className="sr-only peer"
                checked={checked}
                onChange={(e) => handleToggle(option.id, e.target.checked)}
                disabled={readOnly}
              />
              <label htmlFor={inputId} className={optionClassName(option.id)}>
                <span
                  className="mt-px flex h-5 w-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {checked ? (
                    <CheckCircle2 size={18} className="text-brand" />
                  ) : correct && showCorrectness ? (
                    <CheckCircle2 size={18} className="text-success" />
                  ) : null}
                </span>
                <span className="flex-1">{option.text}</span>
                {showCorrectness && correct && !checked && (
                  <span
                    className="ml-2 shrink-0 rounded-full bg-success-soft px-2 py-0.5 text-sm-fluid font-semibold text-success"
                    aria-label="Correct answer"
                  >
                    Correct
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

// --------------------------------------------------------- question nav

function QuizQuestionNavigator({ totalQuestions, currentIndex, answeredIds, onNavigate }) {
  return (
    <>
      <nav aria-label="Quiz questions" className="hidden lg:block">
        <ul className="sticky top-20 flex flex-col gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const answered = answeredIds.has(`${i}`);
            const isCurrent = i === currentIndex;
            const label = answered
              ? `Question ${i + 1}, answered`
              : isCurrent
                ? `Question ${i + 1}, current`
                : `Question ${i + 1}, not answered`;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-label={label}
                  aria-current={isCurrent ? "step" : undefined}
                  className={navButtonClass(answered, isCurrent)}
                >
                  <span className={navDotClass(answered, isCurrent)} aria-hidden="true" />
                  <span className="text-sm-fluid font-medium">Question {i + 1}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Quiz questions" className="lg:hidden">
        <ul className="scrollbar-brand flex snap-x gap-2 overflow-x-auto scroll-px-4 pb-2">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const answered = answeredIds.has(`${i}`);
            const isCurrent = i === currentIndex;
            const label = answered
              ? `Question ${i + 1}, answered`
              : isCurrent
                ? `Question ${i + 1}, current`
                : `Question ${i + 1}, not answered`;
            return (
              <li key={i} className="snap-start">
                <button
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-label={label}
                  aria-current={isCurrent ? "step" : undefined}
                  className={navPillClass(answered, isCurrent)}
                >
                  {i + 1}
                  <span className={navDotClass(answered, isCurrent)} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function navButtonClass(answered, isCurrent) {
  let cls =
    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm-fluid transition-colors";
  if (isCurrent) {
    cls += " border-brand bg-tint-student font-semibold text-ink ring-2 ring-brand ring-offset-2";
  } else if (answered) {
    cls += " border-brand bg-tint-student";
  } else {
    cls += " border-border text-ink-muted hover:border-brand hover:text-ink";
  }
  return cls;
}

function navPillClass(answered, isCurrent) {
  if (isCurrent) {
    return "flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand bg-tint-student text-brand font-semibold text-ink ring-2 ring-brand ring-offset-2";
  }
  if (answered) {
    return "flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand bg-tint-student text-brand font-semibold text-ink";
  }
  return "flex h-10 w-10 items-center justify-center rounded-full border-2 border-border text-ink-muted hover:border-brand hover:text-ink";
}

function navDotClass(answered, isCurrent) {
  if (isCurrent) {
    return "h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-brand bg-white";
  }
  if (answered) {
    return "h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand";
  }
  return "h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-border";
}

// ------------------------------------------------------------ controls

function QuizControls({ onPrev, onNext, onReview, canPrev, isLast, answeredCount, totalCount }) {
  return (
    <div className="card mt-6 flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous question"
          className="btn-outline flex min-w-32 items-center justify-center gap-2 px-4 py-2.5 text-sm-fluid disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={onReview}
            aria-label="Review answers before submitting"
            className="btn-brand flex min-w-32 items-center justify-center gap-2 px-4 py-2.5 text-sm-fluid"
          >
            <ListCheck size={16} aria-hidden="true" />
            Review quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next question"
            className="btn-brand flex min-w-32 items-center justify-center gap-2 px-4 py-2.5 text-sm-fluid"
          >
            Next
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div aria-live="polite" className="text-sm-fluid text-ink-muted">
        <span aria-hidden="true">
          {answeredCount}/{totalCount} answered
        </span>
        <span className="sr-only">
          {` ${answeredCount} of ${totalCount} questions answered`}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------- review screen

function QuizReviewScreen({ spec, answers, answeredCount, totalCount, onEditQuestion, onBack, onSubmit }) {
  const unanswered = spec.questions
    .map((q, i) => ({ q, i, answered: answers[q.id] !== undefined && answers[q.id] !== null }))
    .filter((entry) => !entry.answered);

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-heading font-semibold text-ink">Review your answers</h2>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-soft px-4 py-3">
        <p className="text-sm-fluid text-ink-muted">
          <span className="font-medium text-ink">{answeredCount}</span> of{" "}
          <span className="font-medium text-ink">{totalCount}</span> questions answered
        </p>
        {unanswered.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-sm-fluid font-medium text-amber-800">
            <AlertTriangle size={15} aria-hidden="true" />
            {unanswered.length} unanswered
          </span>
        )}
      </div>

      <ul className="mt-5 space-y-3">
        {spec.questions.map((q, i) => {
          const isUnanswered = answers[q.id] === undefined || answers[q.id] === null;
          return (
            <li
              key={q.id}
              className="flex flex-col gap-2 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm-fluid font-bold " +
                    (isUnanswered
                      ? "border-2 border-amber-300 bg-amber-100 text-amber-800"
                      : "border-2 border-brand bg-tint-student text-brand")
                  }
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 text-sm-fluid font-medium text-ink">{q.text}</span>
                {isUnanswered && (
                  <span className="inline-flex items-center gap-1 text-sm-fluid font-semibold text-amber-800">
                    <AlertTriangle size={12} aria-hidden="true" />
                    Unanswered
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onEditQuestion(i)}
                aria-label={`Edit question ${i + 1}`}
                className="btn-outline self-start px-3 py-1.5 text-sm-fluid sm:self-auto"
              >
                <Eye size={13} className="mr-1" aria-hidden="true" />
                Edit
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline w-full px-5 py-2.5 text-sm-fluid sm:w-auto"
        >
          Back to questions
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="btn-brand w-full px-5 py-2.5 text-sm-fluid sm:w-auto"
        >
          Submit quiz
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------- results screen

function QuizResultsScreen({
  attempt,
  spec,
  passed,
  attemptNumber,
  maxAttempts,
  remainingAttempts,
  bestScore,
  nextLessonId,
  onNextLesson,
  onRetry,
  onMarkComplete,
  isCompleted,
}) {
  const totalQuestions = spec.questions.length;

  return (
    <div className="space-y-8">
      <section
        className={
          "card p-8 text-center " +
          (passed ? "bg-success-soft" : "bg-amber-50")
        }
        aria-live="assertive"
      >
        <div
          className={
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full " +
            (passed ? "bg-success text-success" : "bg-amber-200 text-amber-800")
          }
        >
          {passed ? (
            <CheckCircle2 size={32} aria-hidden="true" />
          ) : (
            <AlertCircle size={32} aria-hidden="true" />
          )}
        </div>
        <h2 className="mt-4 text-heading font-bold text-ink">
          {attempt.score}%
          {passed ? " — Passed" : " — Needs retry"}
        </h2>
        <p className="mt-2 text-sm-fluid text-ink-muted">
          {attempt.correctCount} out of {attempt.totalCount} correct · Need{" "}
          {spec.passingScore}% to pass
        </p>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Attempt {attemptNumber}
          {maxAttempts === null
            ? " (unlimited attempts)"
            : ` of ${maxAttempts}`}
          {bestScore !== null && bestScore !== attempt.score && (
            <span> · Best score: {bestScore}%</span>
          )}
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-body-lg font-semibold text-ink">Answer review</h3>
        <p className="text-sm-fluid text-ink-muted">
          Correct answers are highlighted in green; your selections in green were
          right, in red were wrong.
        </p>

        {spec.questions.map((question, i) => (
          <div key={question.id} className="card p-5">
            <QuizQuestionCard
              question={question}
              questionIndex={i}
              totalQuestions={totalQuestions}
              value={attempt.answers[question.id] ?? null}
              readOnly
              showCorrectness
            />
            {question.explanation && (
              <p className="mt-4 text-sm-fluid text-ink-muted">
                <span className="font-medium text-ink">Explanation:</span>{" "}
                {question.explanation}
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={20}
            className={passed ? "text-success" : "text-ink-muted"}
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-ink">
              {passed ? "Lesson complete" : "Keep practicing"}
            </p>
            <p className="text-sm-fluid text-ink-muted">
              {passed
                ? "This lesson is now marked complete in your syllabus."
                : "Review the feedback above and try again if you'd like."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {passed && nextLessonId && (
            <button
              type="button"
              onClick={onNextLesson}
              className="btn-brand px-5 py-2.5 text-sm-fluid"
            >
              Continue to next lesson
            </button>
          )}
          {!passed && remainingAttempts && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-brand px-5 py-2.5 text-sm-fluid"
            >
              <RotateCcw size={16} className="mr-1" aria-hidden="true" />
              Retry quiz
            </button>
          )}
          {!passed && !remainingAttempts && (
            <div className="text-sm-fluid text-ink-muted">
              No attempts remaining.
              <br />
              Use "Mark as complete" below to keep moving forward (override only;
              no passing score recorded).
            </div>
          )}
          {!passed && !remainingAttempts && (
            <LessonCompleteButton
              isCompleted={isCompleted}
              onComplete={onMarkComplete}
              lessonTitle="quiz"
            />
          )}
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------------------- engine

export default function LessonPlayerQuiz({ resolved, courseId, isCompleted, onRevision, onComplete }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lessonId = resolved.lessonId;
  const spec = getQuizData(lessonId);
  const questions = spec?.questions ?? [];
  const totalQuestions = questions.length;

  const [state, setState] = useState(() =>
    deriveInitialState(courseId, lessonId, spec, questions, isCompleted)
  );

  const { mode, result, answers, currentQuestion } = state;

  const attempts = getQuizAttempts(DEFAULT_STUDENT_ID, courseId, lessonId) || [];
  const attemptsUsed = attempts.length;
  const passedAttempts = spec
    ? attempts.filter((a) => a.score >= spec.passingScore)
    : [];
  const hasPassed = passedAttempts.length > 0;
  const bestScore = attemptsUsed > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
  const remainingAttempts = hasRemainingAttempts(DEFAULT_STUDENT_ID, courseId, lessonId);
  const answeredCount = countAnswered(questions, answers);
  const answeredIds = buildAnsweredSet(questions, answers);

  useEffect(() => {
    if (mode === "active") {
      saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
    }
  }, [currentQuestion, answers, mode, courseId, lessonId]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (mode === "active" && hasUnsavedAnswers(answers)) {
        saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [mode, answers, courseId, lessonId]);

  useEffect(() => {
    if (mode === "active") {
      saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
    }
    return () => {
      if (mode === "active") {
        saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
      }
    };
  }, [answers, mode, courseId, lessonId]);

  function setMode(newMode, resultOverride) {
    setState((s) => ({
      ...s,
      mode: newMode,
      ...(resultOverride !== undefined ? { result: resultOverride } : {}),
    }));
  }
  function setAnswers(next) {
    setState((s) => ({ ...s, answers: next }));
  }
  function setCurrentQuestion(index) {
    setState((s) => ({
      ...s,
      currentQuestion: typeof index === "function" ? index(s.currentQuestion) : index,
    }));
  }

  function handleAnswer(questionId, nextValue) {
    const next = { ...answers, [questionId]: nextValue };
    setAnswers(next);
    if (mode === "active") {
      saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, next);
    }
  }

  function handleStart() {
    setMode("active");
  }

  function handleResume() {
    setMode("active");
  }

  function handleRetry() {
    setAnswers({});
    setCurrentQuestion(0);
    clearQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId);
    setMode("active", null);
  }

  function navigateQuestion(to) {
    saveQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
    setCurrentQuestion(Math.max(0, Math.min(to, totalQuestions - 1)));
  }

  function handlePrev() {
    setCurrentQuestion((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    if (totalQuestions <= 0) return;
    setCurrentQuestion((i) => Math.min(totalQuestions - 1, i + 1));
  }

  function handleReview() {
    setMode("review");
  }

  function handleBackToQuestions() {
    setMode("active");
  }

  function handleEditQuestion(index) {
    setCurrentQuestion(index);
    setMode("active");
  }

  function handleSubmit() {
    setShowConfirm(true);
  }

  function handleConfirmSubmit() {
    setShowConfirm(false);
    setIsSubmitting(true);
    const outcome = submitQuizAttempt(DEFAULT_STUDENT_ID, courseId, lessonId, answers);
    setIsSubmitting(false);
    setState({
      mode: "results",
      result: {
        attempt: outcome.attempt,
        passed: outcome.passed,
        nextLessonId: outcome.nextLessonId,
        courseCompleted: outcome.courseCompleted,
      },
      answers: {},
      currentQuestion: 0,
    });
    onRevision();
  }

  if (!spec) {
    return (
      <LessonPlayerPlaceholder
        lesson={resolved}
        isCompleted={isCompleted}
        onComplete={onComplete}
      />
    );
  }

  if (mode === "results" && result) {
    const attemptNumber = attemptsUsed || 1;
    return (
      <>
        <QuizResultsScreen
          attempt={result.attempt}
          spec={spec}
          passed={result.passed}
          attemptNumber={attemptNumber}
          maxAttempts={spec.maxAttempts}
          remainingAttempts={remainingAttempts}
          bestScore={bestScore}
          nextLessonId={result.nextLessonId}
          onNextLesson={
            result.nextLessonId
              ? () => navigate(`/student/course/${courseId}/play?lessonId=${result.nextLessonId}`)
              : undefined
          }
          onRetry={handleRetry}
          onMarkComplete={onComplete}
          isCompleted={isCompleted}
        />
      </>
    );
  }

  if (mode === "review") {
    return (
      <>
        <QuizReviewScreen
          spec={spec}
          answers={answers}
          answeredCount={answeredCount}
          totalCount={totalQuestions}
          onEditQuestion={handleEditQuestion}
          onBack={handleBackToQuestions}
          onSubmit={handleSubmit}
        />
        <ConfirmDialog
          open={showConfirm}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirm(false)}
          variant="warning"
          isLoading={isSubmitting}
          title="Submit your quiz?"
          description={
            isSubmitting
              ? "Submitting…"
              : totalQuestions - answeredCount > 0
                ? `${totalQuestions - answeredCount} question${totalQuestions - answeredCount === 1 ? " is" : "s are"} unanswered — they'll count as incorrect.`
                : "Review your answers. You won't be able to change them after submitting."
          }
          confirmLabel="Submit quiz"
          loadingLabel="Submitting…"
        />
      </>
    );
  }

  if (mode === "active") {
    const safeIndex = Math.max(0, Math.min(currentQuestion, totalQuestions - 1));
    const q = questions[safeIndex];
    const canPrev = safeIndex > 0;
    const isLast = safeIndex === totalQuestions - 1;

    return (
      <>
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
          <div className="mb-6 lg:mb-0 lg:sticky lg:top-20">
            <QuizQuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={safeIndex}
              answeredIds={answeredIds}
              onNavigate={navigateQuestion}
            />
          </div>

          <Motion.div
            key={q.id}
            variants={reduced ? undefined : createReveal(false)}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
            className="card p-6 sm:p-8"
            aria-live="polite"
            aria-label={`Question ${safeIndex + 1} of ${totalQuestions}`}
          >
            <QuizQuestionCard
              question={q}
              questionIndex={safeIndex}
              totalQuestions={totalQuestions}
              value={answers[q.id] ?? null}
              onChange={handleAnswer}
              readOnly={false}
              showCorrectness={false}
            />
          </Motion.div>
        </div>

        <div className="mt-6">
          <QuizControls
            onPrev={handlePrev}
            onNext={handleNext}
            onReview={handleReview}
            canPrev={canPrev}
            isLast={isLast}
            answeredCount={answeredCount}
            totalCount={totalQuestions}
          />
        </div>
      </>
    );
  }

  const isOverrideComplete = isCompleted && !hasPassed && attemptsUsed === 0;
  return (
    <>
      <QuizIntroScreen
        spec={spec}
        title={resolved.title}
        duration={resolved.duration}
        attempts={attempts}
        bestScore={bestScore}
        remainingAttempts={remainingAttempts}
        maxAttempts={spec.maxAttempts}
        hasDraft={Boolean(getQuizDraftAnswers(DEFAULT_STUDENT_ID, courseId, lessonId))}
        isPassed={hasPassed}
        isCompleted={isCompleted}
        isOverrideComplete={isOverrideComplete}
        onStart={handleStart}
        onResume={handleResume}
        onRetry={handleRetry}
        onReview={() => setMode("results", result)}
        onNextLesson={() => {}}
        onMarkComplete={onComplete}
      />
    </>
  );
}
