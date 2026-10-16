import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, m as Motion } from "motion/react";
import { BadgeCheck, Building2, Check, FileText, Inbox, User, X } from "lucide-react";
import { toast } from "sonner";
import {
  approveApplication,
  getInstructors,
  getPendingApplications,
  rejectApplication,
} from "src/services/adminData";
import { TUTOR_STATUS } from "src/services/stores/tutorOnboarding";
import { fadeIn, staggerContainer, staggerItem, viewportOnce } from "src/lib/animationVariants";
import { formatRelativeTime } from "src/lib/format";
import Stars from "src/components/ui/Stars";
import ConfirmDialog from "src/components/ui/ConfirmDialog";

const TIER_META = {
  standard: { label: "Standard", Icon: User, badge: "bg-surface-soft text-ink-muted" },
  verified: { label: "Verified", Icon: BadgeCheck, badge: "bg-tint-tutor text-brand-secondary-strong" },
  institutional: { label: "Institutional", Icon: Building2, badge: "bg-amber-100 text-amber-700" },
};

function TabTrigger({ value, badge, children }) {
  return (
    <Tabs.Trigger
      value={value}
      className="group flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm-fluid font-medium text-ink-muted transition-colors hover:text-ink data-[state=active]:border-accent-admin data-[state=active]:text-ink"
    >
      {children}
      {badge > 0 && (
        <span className="badge bg-error-soft text-xs font-semibold text-error">{badge}</span>
      )}
    </Tabs.Trigger>
  );
}

function TierBadge({ tier }) {
  const meta = TIER_META[tier] ?? TIER_META.standard;
  return (
    <span className={`badge ${meta.badge}`}>
      <meta.Icon size={13} className="mr-1" />
      {meta.label}
    </span>
  );
}

/** Review card for a single pending application (live or seeded). */
function ApplicationCard({ app, onApprove, onReject }) {
  return (
    <Motion.li
      layout
      variants={staggerItem}
      className="card p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <User size={20} className="text-brand" />
          </div>
          <div>
            <p className="font-semibold text-ink">{app.name}</p>
            <p className="text-sm-fluid text-ink-muted">{app.headline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {app.isLive && (
            <span className="badge bg-tint-tutor text-xs font-semibold text-brand-secondary-strong">
              This browser
            </span>
          )}
          <TierBadge tier={app.tier} />
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm-fluid text-ink-muted">Subjects</dt>
          <dd className="text-sm-fluid font-medium text-ink">
            {app.subjects.length > 0 ? app.subjects.join(", ") : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm-fluid text-ink-muted">Submitted</dt>
          <dd className="text-sm-fluid font-medium text-ink">
            {formatRelativeTime(app.submittedAt)}
          </dd>
        </div>
        {app.organization && (
          <div className="sm:col-span-2">
            <dt className="text-sm-fluid text-ink-muted">Organization</dt>
            <dd className="text-sm-fluid font-medium text-ink">{app.organization}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 rounded-lg border border-border bg-surface-soft p-3">
        <p className="flex items-center gap-1.5 text-sm-fluid font-medium text-ink">
          <FileText size={14} className="text-ink-muted" />
          Submitted documents
        </p>
        <ul className="mt-2 space-y-1">
          {app.documents.map((doc) => (
            <li key={doc} className="flex items-start gap-2 text-sm-fluid text-ink-muted">
              <Check size={14} className="mt-0.5 shrink-0 text-success" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => onReject(app)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-error font-medium text-error transition hover:bg-error hover:text-white active:scale-[0.97] active:duration-press px-4 py-2 text-sm-fluid"
        >
          <X size={15} />
          Reject
        </button>
        <button
          type="button"
          onClick={() => onApprove(app)}
          className="btn-brand rounded-lg px-4 py-2 text-sm-fluid"
        >
          <Check size={15} />
          Approve
        </button>
      </div>
    </Motion.li>
  );
}

export default function AdminInstructorsPage() {
  const [tab, setTab] = useState("pending");
  const [rejectNote, setRejectNote] = useState("");
  const [dialog, setDialog] = useState(null); // { app, mode: "approve" | "reject" }

  // Queue + roster are read from the localStorage-backed stores. After a
  // decision we refresh both explicitly (see refresh()).
  const [pending, setPending] = useState(() => getPendingApplications());
  const [instructors, setInstructors] = useState(() => getInstructors());

  function refresh() {
    setPending(getPendingApplications());
    setInstructors(getInstructors());
  }

  function openDialog(app, mode) {
    setRejectNote("");
    setDialog({ app, mode });
  }

  function handleApprove() {
    approveApplication(dialog.app.id);
    toast.success(`${dialog.app.name} approved — full instructor access unlocked`);
    setDialog(null);
    refresh();
  }

  function handleReject() {
    rejectApplication(dialog.app.id, rejectNote);
    toast.success(`Changes requested from ${dialog.app.name}`);
    setDialog(null);
    refresh();
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
          <TabTrigger value="pending" badge={pending.length}>
            Pending Verifications
          </TabTrigger>
          <TabTrigger value="active">Active Instructors</TabTrigger>
        </Tabs.List>

        <Tabs.Content value="pending" className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {pending.length === 0 ? (
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
                  New instructor applications appear here for review. Approving one
                  grants full access and adds them to the active roster.
                </p>
              </Motion.div>
            ) : (
              <Motion.ul
                key="list"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {pending.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onApprove={(a) => openDialog(a, "approve")}
                    onReject={(a) => openDialog(a, "reject")}
                  />
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
                  <th className="px-5 py-4 font-medium">Students</th>
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

      <ConfirmDialog
        open={dialog?.mode === "approve"}
        onConfirm={handleApprove}
        onCancel={() => setDialog(null)}
        title={`Approve ${dialog?.app?.name ?? ""}?`}
        description={`This grants full instructor access: publishing, enrollments, and payouts. ${dialog?.app?.name ?? "They"} will be added to the active roster.`}
        confirmLabel="Approve application"
        confirmIcon={Check}
        variant="default"
        icon={BadgeCheck}
      />

      <ConfirmDialog
        open={dialog?.mode === "reject"}
        onConfirm={handleReject}
        onCancel={() => setDialog(null)}
        title={`Request changes from ${dialog?.app?.name ?? ""}?`}
        description="Their application returns to draft and this note explains what to fix."
        confirmLabel="Request changes"
        confirmIcon={X}
        variant="danger"
        icon={X}
      >
        <div className="mt-4">
          <label
            htmlFor="reject-note"
            className="mb-1 block text-sm-fluid font-medium text-ink"
          >
            Note to applicant
          </label>
          <textarea
            id="reject-note"
            rows={3}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="e.g. Your ID scan was unreadable — please re-upload a clearer photo."
            className="input resize-none py-2.5"
          />
          <p className="mt-1 text-sm-fluid text-ink-muted">
            The applicant sees this on their status page.
          </p>
        </div>
      </ConfirmDialog>
    </div>
  );
}
