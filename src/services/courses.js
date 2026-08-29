import { courses } from "src/data/courses.js";
import { institutionById } from "src/data/institutions.js";
import { tutorById } from "src/data/tutors.js";
import curriculumById from "src/data/curriculum.js";
import { reviews } from "src/data/reviews.js";

const enrichedCourses = courses.map((course) => ({
  ...course,
  type:
    course.courseType === "University Course"
      ? "university"
      : course.courseType === "Bootcamp"
        ? "bootcamp"
        : "professional",
  institution: course.institutionId ? institutionById[course.institutionId] : null,
  instructors: course.tutorIds.map((id) => tutorById[id]),
  curriculum: curriculumById[course.id],
}));

export default enrichedCourses;

export const getCourses = () => enrichedCourses;

export const getCourseById = (id) =>
  enrichedCourses.find((course) => course.id === Number(id)) || null;

export const getCourseCurriculum = (id) => curriculumById[Number(id)] || null;

export const getCoursesByInstructor = (tutorId) =>
  enrichedCourses.filter((course) => course.tutorIds.includes(tutorId));

export const getRelatedCourses = (course, limit = 4) =>
  enrichedCourses
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, limit);

export const getCourseReviews = (courseId) =>
  reviews.filter((review) => review.courseId === courseId);
