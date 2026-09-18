import { useState, useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} from "src/services/studentRepository";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import { fadeIn, viewportOnce, createStaggerItem } from "src/lib/animationVariants";
import { NOTEBOOK_COLORS } from "src/lib/chartConfig";
import { GRID_STROKE } from "src/lib/chartConfig";

const courseColors = NOTEBOOK_COLORS;

function getCourseColor(name, coursesWithNotes) {
  const idx = coursesWithNotes.indexOf(name);
  return courseColors[idx % courseColors.length];
}
function NotebookHeader({ color, onBack, titleSlot, actionSlot }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-ink-muted transition hover:bg-gray-50"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}18` }}
        >
          <BookOpen size={20} style={{ color }} />
        </div>
        <div>{titleSlot}</div>
      </div>
      {actionSlot && <div className="ml-auto flex items-center gap-2">{actionSlot}</div>}
    </div>
  );
}
function NoteForm({ color, newNote, setNewNote, onCancel, onSave }) {
  return (
    <div className="card mb-6 overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm-fluid font-semibold text-ink">New Page</h3>
          <button
            onClick={onCancel}
            className="rounded p-1 text-ink-muted/50 transition hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <input
          type="text"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          placeholder="Page title"
          className="input mb-3"
        />
        <textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          placeholder="Write your notes here..."
          rows={4}
          className="input mb-4 resize-none py-3 leading-[1.8]"
        />
        <div className="flex gap-3">
          <button onClick={onSave} className="btn-brand px-5 py-2 text-sm-fluid">
            Save Page
          </button>
          <button onClick={onCancel} className="btn-outline px-5 py-2 text-sm-fluid">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
function NoteEditor({ editNote, setEditNote, onCancel, onSave }) {
  return (
    <div>
      <input
        type="text"
        value={editNote.title}
        onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
        className="mb-4 h-[44px] w-full rounded border border-brand bg-white px-4 text-body-lg font-semibold text-ink outline-none"
      />
      <textarea
        value={editNote.content}
        onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
        rows={10}
        className="mb-4 w-full resize-none rounded border border-brand bg-white px-5 py-4 text-sm-fluid leading-[28px] text-ink outline-none"
      />
      <div className="flex gap-3">
        <button onClick={onSave} className="btn-brand px-5 py-2 text-sm-fluid">
          Save Changes
        </button>
        <button onClick={onCancel} className="btn-outline px-5 py-2 text-sm-fluid">
          Cancel
        </button>
      </div>
    </div>
  );
}
function NotebookShelf({ shelves, onOpen, staggerItem }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">My Notebooks</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Your course notebooks — click to open
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {shelves.map((shelf, i) => (
          <Motion.div key={shelf.name} variants={staggerItem} custom={i}>
            <button
              onClick={() => onOpen(shelf.name)}
              className="group w-full text-left transition hover:-translate-y-1"
            >
              {/* Notebook Cover */}
              <div
                className="relative overflow-hidden rounded-lg shadow-[0_3px_14px_rgba(0,0,0,0.08)] transition group-hover:shadow-[0_6px_22px_rgba(0,0,0,0.13)]"
                style={{ backgroundColor: shelf.color }}
              >
                {/* Spiral binding edge */}
                <div className="absolute left-0 top-0 flex h-full w-[18px] flex-col items-center justify-center gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 rounded-full border-2 border-ink-dark/15 bg-ink-dark/8"
                    />
                  ))}
                </div>

                {/* Cover content */}
                <div className="relative min-h-[220px] pl-7 pr-5 pt-6 pb-5">
                  {/* Decorative lines */}
                  <div className="mb-4 space-y-1.5">
                    <div className="h-px w-full bg-ink-dark/12" />
                    <div className="h-px w-[80%] bg-ink-dark/8" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-[17px] font-bold leading-tight text-ink-dark line-clamp-3">
                    {shelf.name}
                  </h3>

                  {/* Decorative lines below title */}
                  <div className="mt-3 space-y-1.5">
                    <div className="h-px w-full bg-ink-dark/8" />
                    <div className="h-px w-[60%] bg-ink-dark/6" />
                    <div className="h-px w-[40%] bg-ink-dark/4" />
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <FileText size={14} className="text-ink-dark/50" />
                    <span className="text-sm-fluid text-ink-dark/60">
                      {shelf.count} {shelf.count === 1 ? "page" : "pages"}
                    </span>
                  </div>
                </div>

                {/* Bottom shadow */}
                <div className="h-2 w-full bg-ink-dark/5" />
              </div>

              {/* Label below */}
              <p className="mt-3 text-sm-fluid font-medium text-ink line-clamp-1">
                {shelf.name}
              </p>
              <p className="text-sm-fluid text-ink-muted/60">
                {shelf.count} notes
              </p>
            </button>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}
function NotebookView({
  selectedCourse,
  notebookNotes,
  color,
  onBack,
  showForm,
  setShowForm,
  newNote,
  setNewNote,
  onAdd,
  onOpen,
  staggerItem,
}) {
  return (
    <div>
      <NotebookHeader
        color={color}
        onBack={onBack}
        titleSlot={
          <>
            <h1 className="text-heading font-semibold text-ink">{selectedCourse}</h1>
            <p className="text-sm-fluid text-ink-muted">
              {notebookNotes.length}{" "}
              {notebookNotes.length === 1 ? "page" : "pages"}
            </p>
          </>
        }
        actionSlot={
          <button
            type="button"
            aria-label="Add new page"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm-fluid font-medium text-white transition hover:bg-brand/90"
          >
            <Plus size={16} />
            New Page
          </button>
        }
      />

      {showForm && (
        <NoteForm
          color={color}
          newNote={newNote}
          setNewNote={setNewNote}
          onCancel={() => setShowForm(false)}
          onSave={onAdd}
        />
      )}

      {notebookNotes.length === 0 && !showForm ? (
        <div className="flex min-h-[350px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white">
          <div className="text-center">
            <BookOpen size={48} className="mx-auto mb-3 text-ink-muted/20" />
            <p className="text-sm-fluid font-medium text-ink-muted/50">
              No pages yet
            </p>
            <p className="mt-1 text-sm-fluid text-ink-muted/30">
              Click "New Page" to add your first note
            </p>
          </div>
        </div>
      ) : (
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {notebookNotes.map((note, index) => (
            <Motion.div key={note.id} variants={staggerItem} custom={index}>
              <button
                onClick={() => onOpen(note)}
                className="card group relative w-full overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                {/* Page top accent */}
                <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

                {/* Spiral dots */}
                <div className="absolute left-0 top-5 flex flex-col gap-2.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="ml-1 h-1.5 w-1.5 rounded-full border border-gray-300 bg-gray-100"
                    />
                  ))}
                </div>

                {/* Lined page preview */}
                <div
                  className="min-h-[180px] px-5 py-4 pl-8"
                  style={{
                    backgroundImage: `repeating-linear-gradient(transparent, transparent 19px, ${GRID_STROKE} 19px, ${GRID_STROKE} 20px)`,
                    backgroundPositionY: "11px",
                  }}
                >
                  {/* Red margin */}
                  <div className="absolute left-[28px] top-0 h-full w-px bg-brand/15" />

                  <div className="relative">
                    {/* Page number badge */}
                    <span
                      className="mb-2 inline-block rounded px-2 py-0.5 text-sm-fluid font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      PAGE {index + 1}
                    </span>

                    <h4 className="mb-2 text-sm-fluid font-semibold text-ink line-clamp-2">
                      {note.title}
                    </h4>
                    <p className="text-sm-fluid leading-[1.7] text-ink-muted line-clamp-4">
                      {note.content}
                    </p>

                    <p className="mt-3 text-sm-fluid text-ink-muted/40">{note.date}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/5">
                  <span className="translate-y-2 rounded-lg bg-brand px-4 py-2 text-sm-fluid font-medium text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                    Open Page
                  </span>
                </div>
              </button>
            </Motion.div>
          ))}
        </Motion.div>
      )}
    </div>
  );
}
function NotePageView({
  selectedCourse,
  selectedNote,
  color,
  onBack,
  onEdit,
  onDelete,
  editingId,
  editNote,
  setEditNote,
  onSaveEdit,
  notebookNotes,
  onOpen,
  setEditingId,
}) {
  const currentIndex = notebookNotes.findIndex((n) => n.id === selectedNote.id);
  const prev = currentIndex > 0 ? notebookNotes[currentIndex - 1] : null;
  const next =
    currentIndex < notebookNotes.length - 1
      ? notebookNotes[currentIndex + 1]
      : null;

  return (
    <div>
      <NotebookHeader
        color={color}
        onBack={onBack}
        titleSlot={
          <>
            <p className="text-sm-fluid text-ink-muted/60">{selectedCourse}</p>
            <h1 className="text-body-lg font-semibold text-ink">{selectedNote.title}</h1>
          </>
        }
        actionSlot={
          <>
            <button
              onClick={() => onEdit(selectedNote.id)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm-fluid text-ink-muted transition hover:bg-gray-50"
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              onClick={() => onDelete(selectedNote.id)}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm-fluid text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-[800px]">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* Top color bar */}
          <div className="h-2 w-full" style={{ backgroundColor: color }} />

          {/* Spiral binding */}
          <div className="relative">
            <div className="absolute left-0 top-0 flex h-full flex-col items-center justify-start gap-4 pt-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="ml-1 h-3 w-3 rounded-full border-2 border-gray-300 bg-gray-100"
                />
              ))}
            </div>

            {/* Lined paper */}
            <div
              className="min-h-[500px] pl-14 pr-10 pt-8 pb-10"
              style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${GRID_STROKE} 27px, ${GRID_STROKE} 28px)`,
                backgroundPositionY: "19px",
              }}
            >
              {/* Red margin */}
              <div className="absolute left-[44px] top-0 h-full w-px bg-brand/25" />

              <div className="relative">
                {editingId === selectedNote.id ? (
                  <NoteEditor
                    editNote={editNote}
                    setEditNote={setEditNote}
                    onCancel={() => setEditingId(null)}
                    onSave={() => onSaveEdit(selectedNote.id)}
                  />
                ) : (
                  <>
                    <h2 className="mb-6 text-heading font-bold text-ink">
                      {selectedNote.title}
                    </h2>
                    <p className="whitespace-pre-wrap text-sm-fluid leading-[28px] text-ink-muted">
                      {selectedNote.content}
                    </p>
                    <div className="mt-10 border-t border-gray-200 pt-4">
                      <p className="text-sm-fluid text-ink-muted/50">{selectedNote.date}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {prev ? (
            <button
              onClick={() => onOpen(prev)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm-fluid text-ink transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Previous Page
            </button>
          ) : (
            <div />
          )}
          <span className="text-sm-fluid text-ink-muted/50">
            Page {currentIndex + 1} of {notebookNotes.length}
          </span>
          {next ? (
            <button
              onClick={() => onOpen(next)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm-fluid text-ink transition hover:bg-gray-50"
            >
              Next Page
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentNotesPage() {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((v) => v + 1);
  const [view, setView] = useState("shelf"); // shelf | notebook | page
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const notes = useMemo(() => {
    // `revision` forces a fresh read from the repository after each mutation.
    void revision;
    return getNotes();
  }, [revision]);

  const coursesWithNotes = [...new Set(notes.map((n) => n.courseName))];
  const notebookNotes = selectedCourse
    ? notes.filter((n) => n.courseName === selectedCourse)
    : [];
  const shelves = coursesWithNotes.map((name) => ({
    name,
    count: notes.filter((n) => n.courseName === name).length,
    color: getCourseColor(name, coursesWithNotes),
  }));

  function openNotebook(courseName) {
    setSelectedCourse(courseName);
    setView("notebook");
    setShowForm(false);
    setEditingId(null);
  }

  function openPage(note) {
    setSelectedNote(note);
    setView("page");
    setEditingId(null);
  }

  function goBack() {
    if (view === "page") {
      setView("notebook");
      setSelectedNote(null);
      setEditingId(null);
    } else {
      setView("shelf");
      setSelectedCourse(null);
      setShowForm(false);
      setEditingId(null);
    }
  }

  function handleAddNote() {
    if (!newNote.title.trim() || !newNote.content.trim() || !selectedCourse)
      return;
    const existing = notes.find((n) => n.courseName === selectedCourse);
    const courseId = existing ? existing.courseId : 0;
    addNote(courseId, selectedCourse, newNote.title.trim(), newNote.content.trim());
    refresh();
    setNewNote({ title: "", content: "" });
    setShowForm(false);
  }

  function handleDeleteNote(id) {
    deleteNote(id);
    refresh();
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setView("notebook");
    }
  }

  function handleEditNote(id) {
    const note = notes.find((n) => n.id === id);
    setEditingId(id);
    setEditNote({ title: note.title, content: note.content });
  }

  function handleSaveEdit(id) {
    const updated = updateNote(id, editNote.title.trim(), editNote.content.trim());
    if (updated && selectedNote && selectedNote.id === id) {
      setSelectedNote(updated);
    }
    refresh();
    setEditingId(null);
  }

  if (view === "shelf") {
    if (shelves.length === 0) {
      return (
        <StudentEmptyState
          icon={BookOpen}
          title="No notes yet"
          description="Start taking notes from a course — your notebooks will appear here and persist across visits."
          action={{ label: "Go to My Courses", to: "/student/courses" }}
        />
      );
    }
    return <NotebookShelf shelves={shelves} onOpen={openNotebook} staggerItem={staggerItem} />;
  }

  const color = getCourseColor(selectedCourse, coursesWithNotes);

  if (view === "notebook") {
    return (
      <NotebookView
        selectedCourse={selectedCourse}
        notebookNotes={notebookNotes}
        color={color}
        onBack={goBack}
        showForm={showForm}
        setShowForm={setShowForm}
        newNote={newNote}
        setNewNote={setNewNote}
        onAdd={handleAddNote}
        onOpen={openPage}
        staggerItem={staggerItem}
      />
    );
  }

  return (
    <NotePageView
      selectedCourse={selectedCourse}
      selectedNote={selectedNote}
      color={color}
      onBack={goBack}
      onEdit={handleEditNote}
      onDelete={handleDeleteNote}
      editingId={editingId}
      editNote={editNote}
      setEditNote={setEditNote}
      onSaveEdit={handleSaveEdit}
      notebookNotes={notebookNotes}
      onOpen={openPage}
      setEditingId={setEditingId}
    />
  );
}
