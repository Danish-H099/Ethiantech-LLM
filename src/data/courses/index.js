/**
 * LMS course API layer.
 *
 * Composes the persisted `courseResources` (see ./records.js) with their
 * related entities — institution, instructors, and curriculum — the same way
 * an LMS server resolves foreign keys before returning a course payload.
 *
 * Consumers import the enriched course list as the default export, or call the
 * query helpers below to mirror real endpoint calls
 * (e.g. `getCourseById` ≈ `GET /courses/:id`).
 */

import { courseResources } from "./records.js";
import { institutionById } from "../institutions.js";
import { tutorById } from "../tutors.js";
import curriculumById from "../curriculumData.json";

const courses = courseResources.map((course) => ({
  ...course,
  institution: course.institutionId ? institutionById[course.institutionId] : null,
  instructors: course.tutorIds.map((id) => tutorById[id]),
  curriculum: curriculumById[course.id],
}));

export default courses;

/** GET /courses — full enriched course list. */
export const getCourses = () => courses;

/** GET /courses/:id — single course (resolved relations) or null. */
export const getCourseById = (id) =>
  courses.find((course) => course.id === Number(id)) || null;

/** GET /courses/:id/curriculum — sections for one course. */
export const getCourseCurriculum = (id) => curriculumById[Number(id)] || null;

/** GET /instructors/:id/courses — courses taught by a tutor. */
export const getCoursesByInstructor = (tutorId) =>
  courses.filter((course) => course.tutorIds.includes(tutorId));

/** Related courses in the same category (excludes the source course). */
export const getRelatedCourses = (course, limit = 4) =>
  courses
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, limit);
