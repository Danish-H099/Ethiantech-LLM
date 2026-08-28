import { useState, useRef } from "react";
import { AnimatePresence, m as Motion } from "motion/react";
import { Upload, Plus, Trash2, ChevronDown, ChevronUp, Video } from "lucide-react";
import { buttonPress, slideUp } from "src/lib/animationVariants";

const inputBase =
  "input h-[40px]";
const labelBase =
  "mb-1 block text-sm-fluid text-ink/70";
const errorText = "mt-1 text-sm-fluid text-red-500";

const CATEGORIES = [
  "Web Development",
  "AI & ML",
  "Data Science",
  "Design",
  "Business",
  "Mobile Dev",
  "Cloud Computing",
  "Marketing",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const emptyLesson = () => ({ title: "", video: null });
const emptySection = () => ({ title: "", lessons: [emptyLesson()] });

export default function AddCoursePage() {
  const [form, setForm] = useState({
    title: "",
    headings: "",
    description: "",
    price: "",
    category: "",
    level: "",
    tag: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [curriculum, setCurriculum] = useState([emptySection()]);
  const [expandedSection, setExpandedSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  const videoInputRefs = useRef(new Map());

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleFileSelect(file) {
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    dragRef.current?.classList.remove("ring-2", "ring-brand");
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    dragRef.current?.classList.add("ring-2", "ring-brand");
  }

  function handleDragLeave() {
    dragRef.current?.classList.remove("ring-2", "ring-brand");
  }

  function addSection() {
    setCurriculum((prev) => [...prev, emptySection()]);
    setExpandedSection(curriculum.length);
  }

  function removeSection(index) {
    setCurriculum((prev) => prev.filter((_, i) => i !== index));
    if (expandedSection >= curriculum.length - 1) {
      setExpandedSection(Math.max(0, curriculum.length - 2));
    }
  }

  function handleSectionTitleChange(index, value) {
    setCurriculum((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, title: value } : sec))
    );
  }

  function addLesson(sectionIndex) {
    setCurriculum((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, lessons: [...sec.lessons, emptyLesson()] }
          : sec
      )
    );
  }

  function removeLesson(sectionIndex, lessonIndex) {
    setCurriculum((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, lessons: sec.lessons.filter((_, j) => j !== lessonIndex) }
          : sec
      )
    );
  }

  function handleLessonChange(sectionIndex, lessonIndex, field, value) {
    setCurriculum((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              lessons: sec.lessons.map((les, j) =>
                j === lessonIndex ? { ...les, [field]: value } : les
              ),
            }
          : sec
      )
    );
  }

  function handleLessonVideoSelect(sectionIndex, lessonIndex, file) {
    if (file && file.type.startsWith("video/")) {
      handleLessonChange(sectionIndex, lessonIndex, "video", file);
    }
  }

  function removeLessonVideo(sectionIndex, lessonIndex) {
    handleLessonChange(sectionIndex, lessonIndex, "video", null);
    const key = `${sectionIndex}-${lessonIndex}`;
    const input = videoInputRefs.current.get(key);
    if (input) input.value = "";
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim() || form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!form.headings.trim()) {
      newErrors.headings = "Headings are required";
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Enter a valid positive price";
    }
    if (!form.category) {
      newErrors.category = "Please select a category";
    }
    if (!form.level) {
      newErrors.level = "Please select a level";
    }
    if (!thumbnail) {
      newErrors.thumbnail = "Please upload a thumbnail";
    }
    const hasLessonContent = curriculum.some((sec) =>
      sec.lessons.some((les) => les.title.trim() && les.video)
    );
    if (curriculum.length === 0 || !hasLessonContent) {
      newErrors.curriculum = "Add at least one section with one lesson (title + video)";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const courseConfig = {
        title: form.title.trim(),
        headings: form.headings.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        level: form.level,
        tag: form.tag.trim(),
        thumbnail: thumbnail.name,
        curriculum: curriculum.map((sec) => ({
          title: sec.title.trim(),
          lessons: sec.lessons
            .filter((les) => les.title.trim() && les.video)
            .map((les) => ({
              title: les.title.trim(),
              video: les.video.name,
            })),
        })),
      };
      console.log("Course submitted:", courseConfig);
      alert(
        `Course "${courseConfig.title}" created successfully!\n\nPrice: $${courseConfig.price}\nCategory: ${courseConfig.category}\nLevel: ${courseConfig.level}\nSections: ${courseConfig.curriculum.length}`
      );
      setForm({
        title: "",
        headings: "",
        description: "",
        price: "",
        category: "",
        level: "",
        tag: "",
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      setCurriculum([emptySection()]);
      setExpandedSection(0);
      videoInputRefs.current.clear();
      setSubmitted(false);
    }
  }

  return (
    <div className="w-full max-w-[560px]">
      <h1 className="mb-2 page-title">
        Add Course
      </h1>
      <p className="mb-8 text-sm-fluid text-ink-muted">
        Create a new course with details, curriculum, and media
      </p>
      <form onSubmit={handleSubmit} noValidate>
        {/* Course Title */}
        <div className="mb-5">
          <label className={labelBase} htmlFor="course-title">
            Course Title
          </label>
          <input
            id="course-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Type here"
            className={`${inputBase} ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className={errorText}>{errors.title}</p>}
        </div>

        {/* Course Headings */}
        <div className="mb-5">
          <label className={labelBase} htmlFor="course-headings">
            Course Headings
          </label>
          <input
            id="course-headings"
            type="text"
            name="headings"
            value={form.headings}
            onChange={handleChange}
            placeholder="Type here"
            className={`${inputBase} ${errors.headings ? "border-red-500" : ""}`}
          />
          {errors.headings && <p className={errorText}>{errors.headings}</p>}
        </div>

        {/* Course Description */}
        <div className="mb-5">
          <label className={labelBase} htmlFor="course-description">
            Course Description
          </label>
          <textarea
            id="course-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Type here"
            rows={3}
            className={`input h-[82px] resize-none py-2.5 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className={errorText}>{errors.description}</p>
          )}
        </div>

        {/* Category + Level row */}
        <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label className={labelBase} htmlFor="course-category">Category</label>
            <select
              id="course-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputBase} ${!form.category ? "text-ink/40" : ""} ${errors.category ? "border-red-500" : ""}`}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className={errorText}>{errors.category}</p>}
          </div>

          <div className="flex-1">
            <label className={labelBase} htmlFor="course-level">Level</label>
            <select
              id="course-level"
              name="level"
              value={form.level}
              onChange={handleChange}
              className={`${inputBase} ${!form.level ? "text-ink/40" : ""} ${errors.level ? "border-red-500" : ""}`}
            >
              <option value="" disabled>Select level</option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            {errors.level && <p className={errorText}>{errors.level}</p>}
          </div>
        </div>

        {/* Tag */}
        <div className="mb-5">
          <label className={labelBase} htmlFor="course-tag">
            Course Tag <span className="text-sm-fluid text-ink/40">(optional)</span>
          </label>
          <input
            id="course-tag"
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="e.g. FULL STACK, DESIGN"
            className={`${inputBase}`}
          />
        </div>

        {/* Price + Thumbnail row */}
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Course Price */}
          <div className="flex-1">
            <label className={labelBase} htmlFor="course-price">
              Course Price
            </label>
            <input
              id="course-price"
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              className={`${inputBase} ${errors.price ? "border-red-500" : ""}`}
            />
            {errors.price && <p className={errorText}>{errors.price}</p>}
          </div>

          {/* Course Thumbnail */}
          <div className="flex-1">
            <label className={labelBase} htmlFor="course-thumbnail">
              Course Thumbnail
            </label>
            {thumbnailPreview ? (
              <div className="relative flex h-[40px] w-full items-center justify-center overflow-hidden rounded border border-transparent">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnail(null);
                    setThumbnailPreview(null);
                    fileInputRef.current.value = "";
                  }}
                  className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-sm-fluid text-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                ref={dragRef}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative flex h-[40px] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-brand bg-brand transition hover:opacity-90 ${
                  errors.thumbnail ? "ring-2 ring-red-500" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-white">
                  <Upload size={16} />
                  <span className="text-sm-fluid">
                    Upload
                  </span>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              id="course-thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            {errors.thumbnail && (
              <p className={errorText}>{errors.thumbnail}</p>
            )}
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mb-6">
          <h2 className={`${labelBase} text-body-lg font-semibold text-ink`}>
            Course Curriculum
          </h2>
          <p className="mb-3 text-sm-fluid text-ink/50">
            Add sections and lessons to build your course structure.
          </p>

          {errors.curriculum && (
            <p className="mb-3 text-sm-fluid text-red-500">{errors.curriculum}</p>
          )}

          <div className="space-y-3">
            {curriculum.map((section, sIdx) => {
              const isExpanded = expandedSection === sIdx;
              return (
                <div
                  key={sIdx}
                  className="rounded border border-ink/15 bg-surface-soft"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSection(isExpanded ? -1 : sIdx)
                      }
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} className="shrink-0 text-ink/50" />
                      ) : (
                        <ChevronDown size={16} className="shrink-0 text-ink/50" />
                      )}
                      <span className="text-sm-fluid font-medium text-ink/60">
                        Section {sIdx + 1}
                      </span>
                    </button>
                    {curriculum.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sIdx)}
                        className="shrink-0 rounded p-1 text-ink/40 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Section body (expanded) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <Motion.div
                        key="section-body"
                        variants={slideUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-t border-ink/10 bg-white px-3 pb-3 pt-3"
                      >
                      {/* Section title */}
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(sIdx, e.target.value)
                        }
                        placeholder="Section title"
                        className={`${inputBase} mb-3`}
                      />

                      {/* Lessons */}
                      <div className="space-y-2">
                        {section.lessons.map((lesson, lIdx) => {
                          const refKey = `${sIdx}-${lIdx}`;
                          return (
                            <div
                              key={lIdx}
                              className="flex items-center gap-2"
                            >
                              <span className="shrink-0 text-sm-fluid text-ink/40">
                                {sIdx + 1}.{lIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) =>
                                  handleLessonChange(
                                    sIdx,
                                    lIdx,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Lesson title"
                                className={`${inputBase} flex-1 !h-[36px] text-sm-fluid`}
                              />
                              {/* Video upload */}
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                ref={(el) => {
                                  if (el) videoInputRefs.current.set(refKey, el);
                                }}
                                onChange={(e) =>
                                  handleLessonVideoSelect(
                                    sIdx,
                                    lIdx,
                                    e.target.files[0]
                                  )
                                }
                              />
                              {lesson.video ? (
                                <div className="flex shrink-0 items-center gap-1.5 rounded border border-ink/15 bg-surface-soft px-2 py-1">
                                  <Video size={13} className="shrink-0 text-brand" />
                                  <span className="max-w-[100px] truncate text-sm-fluid text-ink/70">
                                    {lesson.video.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeLessonVideo(sIdx, lIdx)
                                    }
                                    className="shrink-0 rounded text-ink/40 transition hover:text-red-500"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    videoInputRefs.current
                                      .get(refKey)
                                      ?.click()
                                  }
                                  className="flex shrink-0 items-center gap-1 rounded border border-brand bg-brand px-2 py-1 text-sm-fluid text-white transition hover:opacity-90"
                                >
                                  <Upload size={12} />
                                  Video
                                </button>
                              )}
                              {section.lessons.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLesson(sIdx, lIdx)}
                                  className="shrink-0 rounded p-1 text-ink/30 transition hover:text-red-500"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Add lesson button */}
                      <button
                        type="button"
                        onClick={() => addLesson(sIdx)}
                        className="mt-3 flex items-center gap-1.5 text-sm-fluid font-medium text-brand transition hover:text-brand/80"
                      >
                        <Plus size={14} />
                        Add Lesson
                      </button>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Add section button */}
          <button
            type="button"
            onClick={addSection}
            className="mt-3 flex items-center gap-1.5 text-sm-fluid font-medium text-brand transition hover:text-brand/80"
          >
            <Plus size={15} />
            Add Section
          </button>
        </div>

        {/* ADD button */}
        <Motion.button
          type="submit"
          variants={buttonPress}
          whileTap="tap"
          className="flex h-[40px] w-full items-center justify-center rounded bg-brand text-sm-fluid text-white transition hover:bg-brand/90 sm:w-[91px]"
        >
          ADD
        </Motion.button>
      </form>
    </div>
  );
}
