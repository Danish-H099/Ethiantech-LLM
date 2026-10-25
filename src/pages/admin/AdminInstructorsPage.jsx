import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, m as Motion } from "motion/react";
import { Check, Inbox, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { getInstructors } from "src/services/adminData";
import { fadeIn, viewportOnce } from "src/lib/animationVariants";
import Stars from "src/components/ui/Stars";
import { approveTutor, fetchPendingTutors } from "src/services/adminApproval";

function TabTrigger({ value, badge, children }) {
  return (
    <Tabs.Trigger
      value={value}
      className="group flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm-fluid font-medium text-ink-muted transition-colors hover:text-ink data-[state=active]:border-accent-admin data-[state=active]:text-ink"
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="badge bg-error-soft text-xs font-semibold text-error">{badge}</span>
      )}
    </Tabs.Trigger>
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

export default function AdminInstructorsPage() {
  const [tab, setTab] = useState("pending");
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const [instructors] = useState(() => getInstructors());

  async function loadPending() {
    try {
      setLoading(true);
      setError("");
      const tutors = await fetchPendingTutors();
      setPendingTutors(tutors);
    } catch (err) {
      setError(err.message || "Failed to load pending tutors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(tutor) {
    if (!tutor?.id) return;
    try {
      setApprovingId(tutor.id);
      await approveTutor(tutor.id);
      toast.success(`${tutor.fullName} approved`);
      setPendingTutors((prev) => prev.filter((t) => t.id !== tutor.id));
    } catch (err) {
      toast.error(err.message || "Failed to approve tutor.");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Instructors</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">
          Manage instructors and review pending verification applications
        </p>
      </div>

      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List
          aria-label="Instructor views"
          className="flex gap-1 overflow-x-auto border-b border-border"
        >
          <TabTrigger value="pending" badge={pendingTutors.length}>
            Pending Verifications
          </TabTrigger>
          <TabTrigger value="active">Active Instructors</TabTrigger>
        </Tabs.List>

        <Tabs.Content value="pending" className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <Motion.div
                key="loading"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="card flex items-center justify-center gap-2 px-6 py-12 text-ink-muted"
              >
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm-fluid">Loading pending tutors...</span>
              </Motion.div>
            ) : error ? (
              <Motion.div
                key="error"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="card flex flex-col items-center gap-3 px-6 py-12 text-center"
              >
                <p className="font-semibold text-ink">Failed to load</p>
                <p className="max-w-sm text-sm-fluid text-ink-muted">{error}</p>
                <button type="button" onClick={loadPending} className="btn-brand mt-2 px-4 py-2 text-sm-fluid">
                  Retry
                </button>
              </Motion.div>
            ) : pendingTutors.length === 0 ? (
              <Motion.div
                key="empty"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="card flex flex-col items-center gap-3 px-6 py-16 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
                  <Inbox size={22} className="text-ink-muted" />
                </div>
                <p className="font-semibold text-ink">No applications waiting</p>
                <p className="max-w-sm text-sm-fluid text-ink-muted">
                  No pending tutors found.
                </p>
              </Motion.div>
            ) : (
              <Motion.ul
                key="list"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {pendingTutors.map((tutor) => (
                  <Motion.li
                    layout
                    key={tutor.id}
                    className="card flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <User size={20} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{tutor.fullName}</p>
                        <p className="text-sm-fluid text-ink-muted">
                          {tutor.headline} • {tutor.nationality} • {tutor.age} • {tutor.gender}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          Created: {formatDate(tutor.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApprove(tutor)}
                      disabled={approvingId === tutor.id}
                      className="btn-brand rounded-lg px-4 py-2 text-sm-fluid disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {approvingId === tutor.id ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          Approve
                        </>
                      )}
                    </button>
                  </Motion.li>
                ))}
              </Motion.ul>
            )}
          </AnimatePresence>
        </Tabs.Content>

        <Tabs.Content value="active" className="pt-6">
          <Motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="card scrollbar-brand overflow-x-auto"
          >
            <table className="w-full min-w-[750px] border-collapse">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-4 font-medium">Instructor</th>
                  <th className="px-5 py-4 font-medium">Courses</th>
                  <th className="px-5 py-4 font-medium">Learners</th>
                  <th className="px-5 py-4 font-medium">Avg Rating</th>
                  <th className="px-5 py-4 text-right font-medium">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((inst) => (
                  <tr key={inst.id} className="table-row odd:bg-surface-soft">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-brand/10">
                          <User size={18} className="text-brand" />
                        </div>
                        <span className="whitespace-nowrap font-medium text-ink">
                          {inst.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{inst.courses}</td>
                    <td className="px-5 py-4">{inst.students.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-ink">{inst.rating}</span>
                        <Stars rating={inst.rating} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-ink">
                      ${inst.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Motion.div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
