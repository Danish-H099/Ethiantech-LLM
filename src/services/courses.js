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

// Scores catalog courses against the user's wishlist profile (category,
// topics, skills, subcategories) and returns the strongest matches. Falls
// back to popularity when the wishlist is empty or nothing matches.
export function getWishlistRecommendations(wishlistedCourses, excludedIds = [], limit = 4) {
  const excluded = new Set(excludedIds.map(Number));

  if (wishlistedCourses.length === 0) {
    return enrichedCourses
      .filter((course) => !excluded.has(course.id))
      .sort((a, b) => b.students - a.students)
      .slice(0, limit);
  }

  const profile = new Map();
  const bump = (key, weight) => profile.set(key, (profile.get(key) ?? 0) + weight);
  wishlistedCourses.forEach((course) => {
    if (course.category) bump(`category:${course.category}`, 1);
    (course.topics ?? []).forEach((topic) => bump(`topic:${topic}`, 2));
    (course.skills ?? []).forEach((skill) => bump(`skill:${skill}`, 2));
    (course.subcategories ?? []).forEach((sub) => bump(`sub:${sub}`, 3));
  });

  const score = (course) => {
    let total = 0;
    if (course.category && profile.has(`category:${course.category}`)) {
      total += profile.get(`category:${course.category}`);
    }
    (course.topics ?? []).forEach((topic) => {
      if (profile.has(`topic:${topic}`)) total += profile.get(`topic:${topic}`);
    });
    (course.skills ?? []).forEach((skill) => {
      if (profile.has(`skill:${skill}`)) total += profile.get(`skill:${skill}`);
    });
    (course.subcategories ?? []).forEach((sub) => {
      if (profile.has(`sub:${sub}`)) total += profile.get(`sub:${sub}`);
    });
    return total;
  };

  const matched = enrichedCourses
    .filter((course) => !excluded.has(course.id))
    .map((course) => ({ course, score: score(course) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.course.students - a.course.students)
    .slice(0, limit)
    .map(({ course }) => course);

  if (matched.length > 0) return matched;

  return enrichedCourses
    .filter((course) => !excluded.has(course.id))
    .sort((a, b) => b.students - a.students)
    .slice(0, limit);
}

export const getCourseReviews = (courseId) =>
  reviews.filter((review) => review.courseId === Number(courseId));
