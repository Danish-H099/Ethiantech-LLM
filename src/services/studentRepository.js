export {
  getProfile as getStudentProfile,
  updateProfile as updateStudentProfile,
  updatePreferences,
  resetPreferences,
  getAllStudents,
  getStudentById,
} from "src/services/studentProfileService";

export {
  getEnrolledCourses,
  getEnrolledCourseData,
  getEnrolledCourseIds,
  enrollInCourse,
  updateLastAccessed,
  getRecommendedCourses,
} from "src/services/studentEnrollmentService";

export {
  getLessonProgress,
  updateLessonProgress,
  completeLesson,
  recordLessonAccess,
  getCourseProgress,
  getResumeLesson,
  clearCourseProgress,
  getEnrolledCourseView,
  getAllLessonProgress,
} from "src/services/studentProgressService";

export {
  getQuizData,
  getQuizAttempts,
  getQuizDraftAnswers,
  saveQuizDraftAnswers,
  clearQuizDraftAnswers,
  hasRemainingAttempts,
  getQuizBestScore,
  submitQuizAttempt,
} from "src/services/studentQuizService";

export {
  getExerciseData,
  getSubmissionRecord,
  getSubmissionDraft,
  saveSubmissionDraft,
  clearSubmissionDraft,
  submitAssignmentAttempt,
  resetSubmission,
} from "src/services/studentExerciseService";

export {
  getGrades,
  getGradeDetail,
  getPerformanceByCategory,
  getCourseScores,
} from "src/services/studentGradeService";

export {
  getLearningActivity,
  getStreak,
  getStudyActivity,
  getQuizMastery,
  getScoreTrend,
  getSkillMastery,
  getLearningPace,
} from "src/services/studentAnalyticsService";

export {
  getWishlistedCourses,
  toggleWishlist,
  isCourseWishlisted,
  addCourseToWishlist,
  enrollFromWishlist,
} from "src/services/studentWishlistService";

export {
  getTasks,
  getUpcomingDeadlines,
} from "src/services/taskService";

export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "src/services/notificationService";

export {
  getStudentCertificates,
} from "src/services/certificateService";

export {
  getAllNotes as getNotes,
  getNotesForCourse,
  addNote,
  updateNote,
  deleteNote,
  getNotesForLesson,
  addLessonNote,
  getRecentNotes,
} from "src/services/stores/notesStore";


export {
  getCommentsForLesson,
  addComment,
} from "src/services/stores/lessonComments";

export {
  resolveLesson,
  getLessonMediaFor,
  getCourseAnnouncementsFor,
  getCourseResourcesFor,
} from "src/services/courseUtils";
