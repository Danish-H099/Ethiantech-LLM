import { useEffect, useState, useCallback, useId, useRef } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  getExerciseData,
  getSubmissionRecord,
  saveSubmissionDraft,
  submitAssignmentAttempt,
  resetSubmission,
} from "src/services/studentRepository";
import { createReveal } from "src/lib/animationVariants";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  RotateCcw,
  Calendar,
  Upload,
  File as FileIcon,
  Image,
  FileText,
  File,
  X,
} from "lucide-react";
import LessonPlayerPlaceholder from "src/components/student/LessonPlayerPlaceholder";
import LessonCompleteButton from "src/components/student/LessonCompleteButton";

const MODE_INSTRUCTIONS = "instructions";
const MODE_EDIT = "edit";
const MODE_SUBMITTED = "submitted";

// ------------------------------------------------------------- attachments

function readAttachment(file, maxSize) {
  return new Promise((resolve) => {
    if (file.size > maxSize) {
      resolve(null);
      return;
    }

    if (/^image\//.test(file.type)) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("text/") || file.type.includes("javascript")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const maxLen = 4000;
        resolve(text.length > maxLen ? `${text.slice(0, maxLen)}\n…(truncated)` : text);
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    } else {
      resolve(null);
    }
  });
}

function AttachmentList({ attachments, onRemove }) {
  if (!attachments || attachments.length === 0) return null;

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImage(type) {
    return type && type.startsWith("image/");
  }

  function isCode(type) {
    if (!type) return false;
    const codeTypes = [
      "text/",
      "application/javascript",
      "application/json",
      "application/xml",
      "text/javascript",
    ];
    return codeTypes.some((t) => type.startsWith(t));
  }

  return (
    <div className="space-y-3">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint-student/30">
            {isImage(att.type) ? (
              <Image size={20} className="text-brand" aria-hidden="true" />
            ) : isCode(att.type) ? (
              <FileText size={20} className="text-brand" aria-hidden="true" />
            ) : (
              <File size={20} className="text-ink-muted" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {isImage(att.type) && att.preview ? (
              <img
                src={att.preview}
                alt={att.name}
                className="mb-1 max-h-20 w-full rounded border border-border object-contain"
                loading="lazy"
              />
            ) : isCode(att.type, att.name) ? (
              <pre className="mb-1 max-h-24 overflow-y-auto rounded border border-border bg-gray-50 px-2 py-1.5 text-sm-fluid font-mono text-ink-muted">
                {att.preview || <em>No preview available</em>}
              </pre>
            ) : null}
            <p className="truncate text-sm-fluid font-medium text-ink">{att.name}</p>
            <p className="text-sm-fluid text-ink-muted">
              {formatFileSize(att.size)} · {att.type || "Unknown type"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(att.id)}
            aria-label={`Remove ${att.name}`}
            className="shrink-0 rounded-lg p-1 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:bg-gray-100 hover:text-error focus:opacity-100 focus:outline-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

function AttachmentDropzone({ maxFiles, maxFileSize, accept, disabled, onFiles }) {
  const inputId = useId();
  const inputRef = useRef(null);

  function handleFiles(selected) {
    if (!selected || selected.length === 0) return;
    onFiles(Array.from(selected));
  }

  function handleDrop(e) {
    e.preventDefault();
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFiles(Array.from(files).slice(0, maxFiles));
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function formatSize(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept?.join(", ")}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
        disabled={disabled}
      />
      <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={
          disabled
            ? "flex min-h-[120px] cursor-not-allowed items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50 px-4 text-center"
            : "flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface transition hover:border-brand hover:bg-tint-student focus-within:border-brand focus-within:outline-none"
        }
        aria-label="Attach files"
      >
        <div className="flex flex-col items-center gap-2">
          <Upload size={24} className="text-ink-muted" aria-hidden="true" />
          <div>
            <span className="font-medium text-ink">Click to upload or drag & drop</span>
            <p className="text-sm-fluid text-ink-muted mt-1">
              Up to {maxFiles} file{maxFiles === 1 ? "" : "s"}, max {formatSize(maxFileSize)} each
            </p>
          </div>
        </div>
      </label>
    </>
  );
}

// ------------------------------------------------------------- editor

function SubmissionEditor({ spec, content, attachments, error, isReadOnly, onChange }) {
  const maxFiles = spec.attachments?.max ?? 3;
  const maxSize = spec.attachments?.maxSize ?? 1048576;

  useEffect(() => {
    function handleDragOver(e) {
      e.preventDefault();
    }
    function handleDrop(e) {
      e.preventDefault();
    }
    if (!isReadOnly && spec.attachments?.allow) {
      document.addEventListener("dragover", handleDragOver);
      document.addEventListener("drop", handleDrop);
    }
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [isReadOnly, spec.attachments?.allow]);

  const handleContentChange = useCallback(
    (e) => {
      onChange({ content: e.target.value, attachments });
    },
    [attachments, onChange]
  );

  const handleFiles = useCallback(
    async (selectedFiles) => {
      const existing = attachments.length;
      const slots = maxFiles - existing;
      if (slots <= 0) return;

      const filesToAdd = selectedFiles.slice(0, slots);
      const newAttachments = await Promise.all(
        filesToAdd.map(async (file, i) => {
          const preview = await readAttachment(file, maxSize);
          return {
            id: `${file.name}-${Date.now()}-${i}`,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            preview: preview ?? undefined,
          };
        })
      );

      onChange({
        content,
        attachments: [...attachments, ...newAttachments].slice(0, maxFiles),
      });
    },
    [attachments, content, maxFiles, maxSize, onChange]
  );

  const handleRemove = useCallback(
    (id) => {
      onChange({ content, attachments: attachments.filter((a) => a.id !== id) });
    },
    [attachments, content, onChange]
  );

  const inputMode = spec.primaryInput === "link" ? "url" : "text";
  const inputType =
    spec.primaryInput === "code"
      ? "textarea"
      : spec.primaryInput === "link"
        ? "input"
        : "textarea";
  const isContentEmpty = content.trim().length === 0;

  return (
    <div className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-error-soft px-3 py-2 text-sm-fluid text-error"
        >
          {error}
        </div>
      )}

      {inputType === "input" ? (
        <input
          type={inputMode}
          value={content}
          onChange={handleContentChange}
          readOnly={isReadOnly}
          placeholder="https://your-portfolio-link.com or GitHub repo URL"
          className="input w-full px-4 py-3 text-sm-fluid"
          aria-label="Submission link"
        />
      ) : (
        <>
          <textarea
            value={content}
            onChange={handleContentChange}
            readOnly={isReadOnly}
            placeholder={
              spec.primaryInput === "code"
                ? `Write your code here (language: ${spec.language || "text"})…`
                : spec.primaryInput === "link"
                  ? "Paste your submission link here…"
                  : "Write your response here…"
            }
            className={
              spec.primaryInput === "code"
                ? "input min-h-[160px] sm:min-h-[200px] md:min-h-[240px] w-full resize-y font-mono text-sm-fluid px-4 py-3"
                : "input min-h-[140px] sm:min-h-[180px] md:min-h-[200px] w-full resize-y text-sm-fluid px-4 py-3"
            }
            aria-label={
              spec.primaryInput === "code"
                ? `Code submission (${spec.language || "text"})`
                : "Submission response"
            }
          />
          {spec.primaryInput === "code" && (
            <p className="text-sm-fluid text-ink-muted">
              Language: <span className="font-medium text-ink">{spec.language || "plain text"}</span>
            </p>
          )}
        </>
      )}

      {spec.attachments?.allow && !isReadOnly && (
        <div>
          <p className="label mb-2 text-sm-fluid font-medium text-ink">
            Attachments {attachments.length > 0 && `(${attachments.length}/${maxFiles})`}
          </p>
          <AttachmentList attachments={attachments} onRemove={handleRemove} />
          {attachments.length < maxFiles ? (
            <div className="mt-3">
              <AttachmentDropzone
                maxFiles={maxFiles - attachments.length}
                maxFileSize={maxSize}
                accept={["image/*", "text/*", "application/pdf", "application/json", "application/javascript"]}
                onFiles={handleFiles}
              />
            </div>
          ) : (
            <p className="mt-2 text-sm-fluid text-ink-muted">
              Maximum {maxFiles} file{maxFiles === 1 ? "" : "s"} attached.
            </p>
          )}
        </div>
      )}

      {spec.attachments?.allow && isReadOnly && attachments.length > 0 && (
        <div>
          <p className="label mb-2 text-sm-fluid font-medium text-ink">Submitted files</p>
          <AttachmentList attachments={attachments} onRemove={() => {}} />
        </div>
      )}

      {isContentEmpty && !isReadOnly && (
        <p className="text-sm-fluid text-ink-muted">
          Add content above to enable submission.
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------------ confirm dialog

function SubmissionConfirmDialog({
  open,
  onConfirm,
  onCancel,
  typeLabel = "assignment",
  content = "",
  attachmentCount = 0,
  isSubmitting = false,
}) {
  const contentLength = content.trim().length;
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          asChild
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            if (isSubmitting) {
              e.preventDefault();
              return;
            }
            e.preventDefault();
            const btn = e.currentTarget.querySelector("[data-confirm]");
            btn?.focus();
          }}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <HelpCircle size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <Dialog.Title className="mb-1 text-body-lg font-semibold text-ink">
                    Submit your {typeLabel.toLowerCase()}?
                  </Dialog.Title>
                  <Dialog.Description className="text-sm-fluid text-ink-muted">
                    {isSubmitting
                      ? "Submitting…"
                      : "Review your submission before sending. After submitting, the lesson is marked complete and you'll see a read-only copy of your work."}
                  </Dialog.Description>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-surface p-3 text-sm-fluid">
                <div className="flex justify-between py-1">
                  <span className="text-ink-muted">Content length</span>
                  <span className="font-medium text-ink">{contentLength} characters</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-muted">Attachments</span>
                  <span className="font-medium text-ink">{attachmentCount}</span>
                </div>
              </div>

              <p className="mt-4 text-sm-fluid text-ink-muted">
                Note: Files are saved to your browser only for this prototype.
                Backend upload is not available yet.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    data-cancel
                    disabled={isSubmitting}
                    className="btn-outline px-4 py-2 text-sm-fluid disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  data-confirm
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="btn-brand px-4 py-2 text-sm-fluid disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Submitting…"
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      Submit {typeLabel.toLowerCase()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ------------------------------------------------------- results screen

function SubmissionResults({ attempt, typeLabel = "Assignment", onReset }) {
  if (!attempt) return null;

  const submittedAt = attempt.submittedAt
    ? new Date(attempt.submittedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "short",
      })
    : "—";

  const content = typeof attempt.content === "string" ? attempt.content : "";
  const attachments = Array.isArray(attempt.attachments) ? attempt.attachments : [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-success-soft p-4 text-center">
        <CheckCircle2 size={32} className="mx-auto text-success" aria-hidden="true" />
        <p className="mt-2 text-body-lg font-semibold text-success">
          Your {typeLabel.toLowerCase()} was submitted
        </p>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          on {submittedAt}
        </p>
      </div>

      <div className="card p-6">
        <h3 className="section-title mb-4">Your submission</h3>

        {content && (
          <div className="whitespace-pre-wrap rounded-lg border border-border bg-surface p-4 text-sm-fluid text-ink">
            {content}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mt-5">
            <h4 className="label mb-2 text-sm-fluid font-medium text-ink">Attached files</h4>
            <div className="space-y-3">
              {attachments.map((att) => (
                <div
                  key={att.id || att.name}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tint-student">
                    <Send size={18} className="text-brand" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm-fluid font-medium text-ink">{att.name}</p>
                    <p className="text-sm-fluid text-ink-muted">
                      {att.type || "File"} · {Math.round(att.size / 1024)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!content && attachments.length === 0 && (
          <p className="text-sm-fluid text-ink-muted">Your submission is empty.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm-fluid text-ink-muted">
          <Calendar size={14} aria-hidden="true" />
          <span>
            Submitted {submittedAt} · No grading yet
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="btn-outline px-4 py-2 text-sm-fluid"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset submission
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------- exercise

function deriveInitialMode(courseId, lessonId, record) {
  if (record?.attempt && record.submittedAt) {
    return MODE_SUBMITTED;
  }
  if (record?.draft && record.draft.content && record.draft.content.trim().length > 0) {
    return MODE_EDIT;
  }
  return MODE_INSTRUCTIONS;
}

export default function LessonPlayerExercise({ resolved, courseId, isCompleted, onRevision, onComplete }) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState(MODE_INSTRUCTIONS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lessonId = resolved.lessonId;
  const spec = getExerciseData(lessonId);

  const initialRecord = getSubmissionRecord(courseId, lessonId);
  const [draft, setDraft] = useState({
    content: initialRecord?.draft?.content || "",
    attachments: initialRecord?.draft?.attachments || [],
  });

  const [attempt, setAttempt] = useState(initialRecord?.attempt || null);

  useEffect(() => {
    setMode(deriveInitialMode(courseId, lessonId, initialRecord));
  }, [courseId, lessonId, initialRecord]);

  const hasAttempt = Boolean(attempt && attempt.submittedAt);
  const hasDraftContent = draft.content.trim().length > 0;
  const canSubmit = hasDraftContent && !hasAttempt;

  useEffect(() => {
    if (mode !== MODE_EDIT) return;
    if (!hasDraftContent && mode === MODE_INSTRUCTIONS) return;

    const timer = setTimeout(() => {
      if (draft.content.trim().length > 0 || draft.attachments.length > 0) {
        saveSubmissionDraft(courseId, lessonId, draft);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [draft, mode, courseId, lessonId, hasDraftContent]);

  useEffect(() => {
    if (mode !== MODE_EDIT || !hasDraftContent) return;

    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [mode, hasDraftContent]);

  useEffect(() => {
    return () => {
      if (mode === MODE_EDIT && hasDraftContent) {
        saveSubmissionDraft(courseId, lessonId, draft);
      }
    };
  }, [mode, hasDraftContent, draft, courseId, lessonId]);

  function handleContentChange(nextDraft) {
    setDraft(nextDraft);
  }

  function handleStart() {
    setMode(MODE_EDIT);
  }

  function handleReview() {
    if (hasDraftContent) setShowConfirm(true);
  }

  function handleConfirmSubmit() {
    setShowConfirm(false);
    setIsSubmitting(true);
    const outcome = submitAssignmentAttempt(courseId, lessonId, draft);
    setIsSubmitting(false);

    if (outcome?.error) {
      setMode(MODE_EDIT);
      return;
    }

    if (outcome) {
      setAttempt(outcome.attempt);
      setDraft({ content: "", attachments: [] });
      setMode(MODE_SUBMITTED);
      onRevision();
    }
  }

  function handleReset() {
    resetSubmission(courseId, lessonId);
    setAttempt(null);
    setDraft({ content: "", attachments: [] });
    setMode(MODE_INSTRUCTIONS);
    onRevision();
  }

  function getSubmissionError() {
    if (!draft.content.trim()) {
      return "Please add some content before submitting.";
    }
    return null;
  }

  const submissionError = canSubmit ? null : getSubmissionError();

  if (!spec) {
    return (
      <LessonPlayerPlaceholder
        lesson={resolved}
        isCompleted={isCompleted}
        onComplete={onComplete}
      />
    );
  }

  const typeLabel = resolved.type === "project" ? "Project" : "Exercise";

  if (mode === MODE_SUBMITTED && attempt) {
    return (
      <SubmissionResults
        attempt={attempt}
        typeLabel={typeLabel}
        onReset={handleReset}
      />
    );
  }

  if (mode === MODE_INSTRUCTIONS || mode === MODE_EDIT) {
    return (
      <>
        <div className="space-y-6">
          {mode === MODE_INSTRUCTIONS && (
            <Motion.div
              key="instructions"
              variants={reduced ? undefined : createReveal(false)}
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
              className="space-y-6"
            >
              <h2 className="text-heading font-semibold text-ink">{resolved.title}</h2>
              <div className="card p-6">
                <pre className="whitespace-pre-wrap text-sm-fluid text-ink">
                  {spec.instructions}
                </pre>
                {spec.deliverable && (
                  <div className="mt-4 rounded-lg bg-surface p-3">
                    <p className="text-sm-fluid font-medium text-ink">What to submit:</p>
                    <pre className="mt-1 whitespace-pre-wrap text-sm-fluid text-ink-muted">
                      {spec.deliverable}
                    </pre>
                  </div>
                )}
              </div>

              {spec.hints && spec.hints.length > 0 && (
                <div className="card p-4">
                  <details className="text-sm-fluid">
                    <summary className="cursor-pointer font-medium text-ink">
                      Hints ({spec.hints.length})
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
                      {spec.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  className="btn-brand px-5 py-2.5 text-sm-fluid"
                >
                  Start Submission
                </button>
                {!isCompleted && (
                  <LessonCompleteButton
                    isCompleted={isCompleted}
                    onComplete={onComplete}
                    lessonTitle={resolved.title}
                  />
                )}
              </div>
            </Motion.div>
          )}

          {mode === MODE_EDIT && (
            <Motion.div
              key="editor"
              variants={reduced ? undefined : createReveal(false)}
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
              className="space-y-6"
            >
              <h2 className="text-heading font-semibold text-ink">{resolved.title}</h2>
              <SubmissionEditor
                spec={spec}
                content={draft.content}
                attachments={draft.attachments}
                error={submissionError}
                onChange={handleContentChange}
              />

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <LessonCompleteButton
                  isCompleted={isCompleted}
                  onComplete={onComplete}
                  lessonTitle={resolved.title}
                />
                <button
                  type="button"
                  onClick={() => setMode(MODE_INSTRUCTIONS)}
                  className="btn-outline px-4 py-2.5 text-sm-fluid"
                >
                  Back to instructions
                </button>
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={!canSubmit}
                  className="btn-brand px-5 py-2.5 text-sm-fluid disabled:opacity-50"
                >
                  Review &amp; Submit
                </button>
              </div>
            </Motion.div>
          )}
        </div>

        <SubmissionConfirmDialog
          open={showConfirm}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirm(false)}
          typeLabel={typeLabel}
          content={draft.content}
          attachmentCount={draft.attachments.length}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  return null;
}
