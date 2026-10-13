import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { FieldError, FileDropzone, RadioPillGroup } from "src/components/tutor/onboarding/wizardFields";
import {
  FIELD_HINT,
  FIELD_INPUT,
  FIELD_LABEL,
} from "src/components/tutor/onboarding/wizardFieldMeta";
import { TUTOR_TIERS } from "src/services/stores/tutorOnboarding";

const ID_DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID card" },
  { value: "drivers_license", label: "Driver's license" },
];

const emptyDegree = () => ({ institution: "", qualification: "", year: "", fileName: "" });
const emptyCertification = () => ({
  name: "",
  issuer: "",
  licenseNumber: "",
  expiry: "",
  fileName: "",
});

function Panel({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-surface-soft p-5">
      <h3 className="text-body-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 text-sm-fluid text-ink-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RepeaterRow({ index, total, label, onRemove, children }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm-fluid font-medium text-ink">
          {label} {index + 1}
        </p>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            className="shrink-0 rounded p-1 text-ink-muted transition hover:text-error"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Step 3 — identity + credentials, rendered dynamically from the chosen track. */
export default function StepCredentials({ tier, verification, onChange, errors }) {
  const requiresDocs = tier !== TUTOR_TIERS.STANDARD;
  const isInstitutional = tier === TUTOR_TIERS.INSTITUTIONAL;
  const degrees = verification.degrees ?? [];
  const certifications = verification.certifications ?? [];
  const organization = verification.organization ?? {};

  function updateList(list, index, patch) {
    onChange({
      [list]: verification[list].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function removeItem(list, index) {
    onChange({ [list]: verification[list].filter((_, i) => i !== index) });
  }

  function addItem(list, factory) {
    onChange({ [list]: [...verification[list], factory()] });
  }

  function updateOrganization(patch) {
    onChange({ organization: { ...organization, ...patch } });
  }

  const addButton =
    "mt-3 flex items-center gap-1.5 text-sm-fluid font-medium text-accent-tutor transition hover:opacity-80";

  return (
    <div className="space-y-5">
      {requiresDocs ? (
        <Panel
          title="Identity verification"
          description="Governments IDs are reviewed by our Trust & Safety team and encrypted in transit — never shown publicly or shared with third parties."
        >
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-white p-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-accent-tutor" />
            <p className="text-sm-fluid text-ink-muted">
              Upload a clear photo or scan of a valid document. All corners must be
              visible, with no glare or covering hands.
            </p>
          </div>
          <RadioPillGroup
            legend="Document type"
            name="tutor-id-type"
            options={ID_DOCUMENT_TYPES}
            value={verification.idType}
            onChange={(idType) => onChange({ idType })}
            error={errors.idType}
          />
          <div className="mt-4">
            <FileDropzone
              id="tutor-id-file"
              accept="image/*,.pdf"
              label="Click or drag your ID document here"
              hint="JPG, PNG or PDF."
              fileName={verification.idFileName}
              onFile={(file) => onChange({ idFileName: file.name })}
              onClear={() => onChange({ idFileName: "" })}
              error={errors.idFile}
            />
          </div>
        </Panel>
      ) : (
        <Panel
          title="No documents needed on the Standard track"
          description="The Standard track runs on your declared experience alone. Upgrade to Verified later to add your ID, degrees, or certifications and unlock paid publishing with the Verified badge."
        />
      )}

      {requiresDocs && (
        <Panel
          title="Education"
          description="Add at least one degree or diploma. Attaching a scan helps our reviewers move faster."
        >
          <div className="space-y-3">
            {degrees.map((degree, index) => (
              <RepeaterRow
                key={`degree-${index}`}
                index={index}
                total={degrees.length}
                label="Degree"
                onRemove={(i) => removeItem("degrees", i)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL} htmlFor={`degree-institution-${index}`}>
                      Institution
                    </label>
                    <input
                      id={`degree-institution-${index}`}
                      type="text"
                      value={degree.institution}
                      onChange={(e) =>
                        updateList("degrees", index, { institution: e.target.value })
                      }
                      placeholder="e.g. Addis Ababa University"
                      className={FIELD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL} htmlFor={`degree-qualification-${index}`}>
                      Qualification
                    </label>
                    <input
                      id={`degree-qualification-${index}`}
                      type="text"
                      value={degree.qualification}
                      onChange={(e) =>
                        updateList("degrees", index, { qualification: e.target.value })
                      }
                      placeholder="e.g. BSc Computer Science"
                      className={FIELD_INPUT}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={FIELD_LABEL} htmlFor={`degree-year-${index}`}>
                    Graduation year{" "}
                    <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <input
                    id={`degree-year-${index}`}
                    type="number"
                    min="1950"
                    max="2035"
                    value={degree.year}
                    onChange={(e) => updateList("degrees", index, { year: e.target.value })}
                    placeholder="e.g. 2015"
                    className={`${FIELD_INPUT} sm:max-w-[180px]`}
                  />
                </div>
                <div className="mt-4">
                  <p className={FIELD_LABEL}>
                    Diploma or transcript{" "}
                    <span className="font-normal text-ink-muted">(optional)</span>
                  </p>
                  <FileDropzone
                    id={`degree-file-${index}`}
                    accept="image/*,.pdf"
                    label="Click or drag a document here"
                    hint="JPG, PNG or PDF."
                    fileName={degree.fileName}
                    onFile={(file) => updateList("degrees", index, { fileName: file.name })}
                    onClear={() => updateList("degrees", index, { fileName: "" })}
                  />
                </div>
                <FieldError>{errors[`degree-${index}`]}</FieldError>
              </RepeaterRow>
            ))}
            {degrees.length === 0 && (
              <p className={FIELD_HINT}>No degrees added yet.</p>
            )}
          </div>
          <button type="button" onClick={() => addItem("degrees", emptyDegree)} className={addButton}>
            <Plus size={15} />
            Add degree
          </button>
        </Panel>
      )}

      <Panel
        title={
          requiresDocs
            ? "Certifications & professional licenses"
            : "Certifications & licenses"
        }
        description={
          requiresDocs
            ? "License numbers are checked against the issuing body. Add at least one degree or certification between the two sections."
            : "Optional on the Standard track — adding a certification helps our reviewers evaluate your application."
        }
      >
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <RepeaterRow
              key={`cert-${index}`}
              index={index}
              total={certifications.length}
              label="Certification"
              onRemove={(i) => removeItem("certifications", i)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={FIELD_LABEL} htmlFor={`cert-name-${index}`}>
                    Certification name
                  </label>
                  <input
                    id={`cert-name-${index}`}
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      updateList("certifications", index, { name: e.target.value })
                    }
                    placeholder="e.g. AWS Solutions Architect"
                    className={FIELD_INPUT}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL} htmlFor={`cert-issuer-${index}`}>
                    Issuing body
                  </label>
                  <input
                    id={`cert-issuer-${index}`}
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateList("certifications", index, { issuer: e.target.value })
                    }
                    placeholder="e.g. Amazon Web Services"
                    className={FIELD_INPUT}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={FIELD_LABEL} htmlFor={`cert-license-${index}`}>
                    License / credential number{" "}
                    <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <input
                    id={`cert-license-${index}`}
                    type="text"
                    value={cert.licenseNumber}
                    onChange={(e) =>
                      updateList("certifications", index, { licenseNumber: e.target.value })
                    }
                    placeholder="e.g. AWS-123456"
                    className={FIELD_INPUT}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL} htmlFor={`cert-expiry-${index}`}>
                    Expiry date{" "}
                    <span className="font-normal text-ink-muted">(optional)</span>
                  </label>
                  <input
                    id={`cert-expiry-${index}`}
                    type="date"
                    value={cert.expiry}
                    onChange={(e) =>
                      updateList("certifications", index, { expiry: e.target.value })
                    }
                    className={FIELD_INPUT}
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className={FIELD_LABEL}>
                  Certificate{" "}
                  <span className="font-normal text-ink-muted">(optional)</span>
                </p>
                <FileDropzone
                  id={`cert-file-${index}`}
                  accept="image/*,.pdf"
                  label="Click or drag a document here"
                  hint="JPG, PNG or PDF."
                  fileName={cert.fileName}
                  onFile={(file) =>
                    updateList("certifications", index, { fileName: file.name })
                  }
                  onClear={() => updateList("certifications", index, { fileName: "" })}
                />
              </div>
              <FieldError>{errors[`cert-${index}`]}</FieldError>
            </RepeaterRow>
          ))}
          {certifications.length === 0 && (
            <p className={FIELD_HINT}>No certifications added yet.</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addItem("certifications", emptyCertification)}
          className={addButton}
        >
          <Plus size={15} />
          Add certification
        </button>
        <FieldError>{errors.credentials}</FieldError>
      </Panel>

      {isInstitutional && (
        <Panel
          title="Organization details"
          description="Institutional Partners verify their organization and the person authorizing the partnership."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={FIELD_LABEL} htmlFor="org-name">
                Organization name
              </label>
              <input
                id="org-name"
                type="text"
                value={organization.name}
                onChange={(e) => updateOrganization({ name: e.target.value })}
                placeholder="e.g. Nairobi Institute of Technology"
                className={`${FIELD_INPUT} ${errors.orgName ? "border-error" : ""}`}
              />
              <FieldError>{errors.orgName}</FieldError>
            </div>
            <div>
              <label className={FIELD_LABEL} htmlFor="org-website">
                Official website
              </label>
              <input
                id="org-website"
                type="text"
                value={organization.website}
                onChange={(e) => updateOrganization({ website: e.target.value })}
                placeholder="e.g. https://nit.ac.ke"
                className={`${FIELD_INPUT} ${errors.orgWebsite ? "border-error" : ""}`}
              />
              <FieldError>{errors.orgWebsite}</FieldError>
            </div>
          </div>
          <div className="mt-4">
            <label className={FIELD_LABEL} htmlFor="org-email">
              Institutional email
            </label>
            <input
              id="org-email"
              type="email"
              value={organization.email}
              onChange={(e) => updateOrganization({ email: e.target.value })}
              placeholder="e.g. partnerships@nit.ac.ke"
              className={`${FIELD_INPUT} ${errors.orgEmail ? "border-error" : ""}`}
            />
            <FieldError>{errors.orgEmail}</FieldError>
          </div>
          <div className="mt-4">
            <p className={FIELD_LABEL}>Proof of affiliation</p>
            <FileDropzone
              id="org-auth-file"
              accept="image/*,.pdf"
              label="Click or drag an authorization letter here"
              hint="PDF, JPG or PNG on official letterhead, signed by an authorized representative."
              fileName={organization.authFileName}
              onFile={(file) => updateOrganization({ authFileName: file.name })}
              onClear={() => updateOrganization({ authFileName: "" })}
              error={errors.orgAuth}
            />
          </div>
        </Panel>
      )}

      <section className="card p-6">
        <label className={FIELD_LABEL} htmlFor="verification-notes">
          Anything else our review team should know?{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="verification-notes"
          rows={3}
          value={verification.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="e.g. My license is being renewed this month — happy to provide a payment receipt."
          className="input resize-none py-2.5"
        />
      </section>
    </div>
  );
}
