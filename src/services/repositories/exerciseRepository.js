import exercises from "src/data/exercises";
import {
  getSubmissionRecord as getSubmissionRecordFromStore,
  saveSubmissionDraft as saveSubmissionDraftToStore,
  clearSubmissionDraft as clearSubmissionDraftFromStore,
  setSubmissionAttempt as setSubmissionAttemptToStore,
  clearSubmissionAttempt as clearSubmissionAttemptFromStore,
} from "src/services/stores/lessonProgressStore";

export function getExerciseData(lessonId) {
  const raw = exercises[String(lessonId)];
  if (!raw || !raw.instructions || raw.instructions.trim().length === 0) return null;
  return {
    title: raw.title || "",
    instructions: raw.instructions,
    deliverable: raw.deliverable || "",
    primaryInput: raw.primaryInput || "text",
    language: raw.language || null,
    hints: Array.isArray(raw.hints) ? raw.hints : [],
    attachments: {
      allow: raw.attachments?.allow ?? true,
      max: raw.attachments?.max ?? 3,
      maxSize: raw.attachments?.maxSize ?? 1048576,
    },
  };
}

export function getSubmissionRecord(studentId, courseId, lessonId) {
  return getSubmissionRecordFromStore(courseId, lessonId);
}

export function getSubmissionDraft(studentId, courseId, lessonId) {
  const record = getSubmissionRecordFromStore(courseId, lessonId);
  return record ? record.draft : null;
}

export function saveSubmissionDraft(studentId, courseId, lessonId, draft) {
  return saveSubmissionDraftToStore(courseId, lessonId, draft);
}

export function clearSubmissionDraft(studentId, courseId, lessonId) {
  return clearSubmissionDraftFromStore(courseId, lessonId);
}

export function submitAssignmentAttempt(studentId, courseId, lessonId, draft) {
  const spec = getExerciseData(lessonId);
  if (!spec) return null;

  const content = draft?.content ?? "";
  if (typeof content !== "string" || content.trim().length === 0) {
    return { error: "Submission cannot be empty." };
  }

  const attempt = Object.freeze({
    content,
    attachments: Array.isArray(draft?.attachments) ? [...draft.attachments] : [],
    submittedAt: new Date().toISOString(),
  });

  setSubmissionAttemptToStore(courseId, lessonId, attempt);

  return { attempt };
}

export function resetSubmission(studentId, courseId, lessonId) {
  clearSubmissionAttemptFromStore(courseId, lessonId);
}