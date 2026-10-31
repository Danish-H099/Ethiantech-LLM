import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";
import { uploadTutorProfile } from "src/services/tutorProfile";

function UploadedFileItem({ file, onRemove, previewUrl }) {
  const isImage = file && file.type && file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand overflow-hidden">
        {isImage || previewUrl ? (
          <img src={previewUrl || URL.createObjectURL(file)} alt={file.name} className="h-10 w-10 object-cover" />
        ) : (
          <FileText size={18} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{file.name}</p>
        <p className="text-xs text-ink-muted">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove file"
        className="shrink-0 rounded-full p-1.5 text-ink-muted hover:text-error hover:bg-error-soft transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function FormField({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600 font-medium" role="alert">{error}</p>}
    </div>
  );
}

export default function TutorProfileForm({ initialData = null, onSuccess = null, onCancel = null }) {

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    headline: initialData?.headline || "",
    about: initialData?.about || "",
    age: initialData?.age ? String(initialData.age) : "",
    gender: initialData?.gender || "",
    nationality: initialData?.nationality || "",
    profileImageFile: null,
    resumeFile: null,
    certFiles: [],
    agreePolicy: false,
  });

  const onField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const countWords = (value) => (value || "").trim().split(/\s+/).filter(Boolean).length;

  const validate = () => {
    const e = {};
    if (!form.fullName?.trim()) e.fullName = "Full name is required.";
    const hw = countWords(form.headline);
    if (!form.headline?.trim()) e.headline = "Headline is required.";
    else if (hw > 10) e.headline = `Headline must be 10 words or less (${hw}).`;
    const aw = countWords(form.about);
    if (!form.about?.trim()) e.about = "About you is required.";
    else if (aw > 80) e.about = `Keep it under 80 words (${aw}).`;
    if (!form.age?.trim()) e.age = "Age is required.";
    else if (Number(form.age) < 18 || Number(form.age) > 120) e.age = "Enter a valid age.";
    if (!form.gender) e.gender = "Select an option.";
    if (!form.profileImageFile) e.profileImage = "Profile image is required.";
    if (!form.resumeFile) e.resume = "Resume is required.";
    if (!form.nationality?.trim()) e.nationality = "Nationality is required.";
    if (!form.agreePolicy) e.agreePolicy = "Agree to the terms and conditions to continue.";
    if (form.certFiles?.length > 5) e.certificates = "Maximum 5 certificates allowed.";
    else if (form.certFiles?.length > 0) {
      const bad = form.certFiles.filter((f) => {
        const ext = (f.name || "").split(".").pop()?.toLowerCase();
        return !["pdf", "doc", "docx"].includes(ext);
      });
      if (bad.length) e.certificates = "Only PDF, DOC, DOCX files are allowed.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onPhotoDrop = useCallback((f) => {
    if (f && f[0]) {
      if (f[0].size > 5 * 1024 * 1024) { setErrors({ profileImage: "Image must be under 5MB." }); return; }
      setForm((p) => ({ ...p, profileImageFile: f[0] }));
      setErrors({});
    }
  }, []);

  const onResumeDrop = useCallback((f) => {
    if (f && f[0]) setForm((p) => ({ ...p, resumeFile: f[0] }));
  }, []);

  const onCertDrop = useCallback((f) => {
    if (f && f.length) setForm((p) => ({ ...p, certFiles: f }));
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await uploadTutorProfile({
        fullName: form.fullName.trim(),
        headline: form.headline.trim(),
        about: form.about.trim(),
        age: Number(form.age),
        gender: form.gender,
        nationality: form.nationality.trim(),
        profileImage: form.profileImageFile || undefined,
        resume: form.resumeFile || undefined,
        certificates: form.certFiles || [],
      });
      toast.success("Tutor profile saved and submitted successfully!");
      if (onSuccess) {
        onSuccess(res.profile);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      const msg = err.message || "Unable to save tutor profile. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const photoDrop = useDropzone({ onDrop: onPhotoDrop, accept: { "image/*": [] }, maxFiles: 1, disabled: isLoading });
  const resumeDrop = useDropzone({ onDrop: onResumeDrop, accept: { ".pdf": [], ".doc": [], ".docx": [] }, maxFiles: 1, disabled: isLoading });
  const certDrop = useDropzone({
    onDrop: (f) => {
      if (f && f.length > 5) {
        setErrors((p) => ({ ...p, certificates: "Maximum 5 certificates allowed." }));
        return;
      }
      onCertDrop(f);
    },
    accept: ".pdf,.doc,.docx",
    maxFiles: 5,
    disabled: isLoading,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <section aria-labelledby="basic-heading" className="space-y-4">
          <h2 id="basic-heading" className="section-title">Basic Info</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="fullName" label="Full Name" error={errors.fullName || ""}>
              <input id="fullName" value={form.fullName} onChange={onField("fullName")} className={`input ${errors.fullName ? "border-red-400 ring-1 ring-red-200" : ""}`} placeholder="e.g. Amina Bekele" disabled={isLoading} />
            </FormField>
            <FormField id="headline" label="Headline (max 10 words)" error={errors.headline || ""}>
              <input id="headline" value={form.headline} onChange={onField("headline")} className={`input ${errors.headline ? "border-red-400 ring-1 ring-red-200" : ""}`} placeholder="e.g. Senior Cloud Architect" disabled={isLoading} />
            </FormField>
          </div>
          <FormField id="about" label="About You (max 80 words)" error={errors.about || ""}>
            <textarea id="about" rows={4} value={form.about} onChange={onField("about")} className={`input resize-none py-2.5 ${errors.about ? "border-red-400 ring-1 ring-red-200" : ""}`} placeholder="What do you teach?" disabled={isLoading} />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className={`text-xs font-medium ${countWords(form.about) > 80 ? "text-red-600" : "text-ink-muted"}`}>{countWords(form.about)} / 80 words</span>
            </div>
          </FormField>
        </section>

        <section aria-labelledby="details-heading" className="space-y-4 border-t border-border pt-6">
          <h2 id="details-heading" className="section-title">Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="age" label="Age" error={errors.age || ""}>
              <input id="age" type="number" min={18} max={120} value={form.age} onChange={onField("age")} className={`input ${errors.age ? "border-red-400 ring-1 ring-red-200" : ""}`} disabled={isLoading} />
            </FormField>
            <FormField id="gender" label="Gender" error={errors.gender || ""}>
              <select id="gender" value={form.gender} onChange={onField("gender")} className={`input ${errors.gender ? "border-red-400 ring-1 ring-red-200" : ""}`} disabled={isLoading}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </FormField>
            <FormField id="nationality" label="Nationality" error={errors.nationality || ""}>
              <input id="nationality" value={form.nationality} onChange={onField("nationality")} className={`input ${errors.nationality ? "border-red-400 ring-1 ring-red-200" : ""}`} disabled={isLoading} />
            </FormField>
          </div>
        </section>

        <section aria-labelledby="docs-heading" className="space-y-4 border-t border-border pt-6">
          <h2 id="docs-heading" className="section-title">Documents</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="profileImageDrop" className="label">Profile Image <span className="text-ink-muted font-normal">(max 5MB)</span></label>
              <div {...photoDrop.getRootProps()} id="profileImageDrop" className={`mt-2 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${photoDrop.isDragActive ? "border-brand bg-tint-tutor" : form.profileImageFile ? "border-brand bg-tint-tutor" : "border-border bg-white hover:border-brand hover:bg-tint-tutor"} ${errors.profileImage ? "border-red-400 bg-red-50" : ""}`}>
                <input {...photoDrop.getInputProps()} className="hidden" />
                {form.profileImageFile ? (
                  <div><p className="text-sm font-medium text-ink">{form.profileImageFile.name}</p></div>
                ) : (
                  <div><p className="text-sm font-medium text-ink">Drop image or click</p><p className="text-xs text-ink-muted">PNG / JPG — up to 5MB</p></div>
                )}
              </div>
              {errors.profileImage && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.profileImage}</p>}
              {form.profileImageFile && (
                <div className="mt-3">
                  <UploadedFileItem file={form.profileImageFile} onRemove={() => setForm((p) => ({ ...p, profileImageFile: null }))} />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="resumeDrop" className="label">Resume</label>
              <div {...resumeDrop.getRootProps()} id="resumeDrop" className={`mt-2 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${resumeDrop.isDragActive ? "border-brand bg-tint-tutor" : form.resumeFile ? "border-brand bg-tint-tutor" : "border-border bg-white hover:border-brand hover:bg-tint-tutor"} ${errors.resume ? "border-red-400 bg-red-50" : ""}`}>
                <input {...resumeDrop.getInputProps()} className="hidden" />
                {form.resumeFile ? (
                  <div><p className="text-sm font-medium text-ink">{form.resumeFile.name}</p></div>
                ) : (
                  <div><p className="text-sm font-medium text-ink">Drop resume or click</p><p className="text-xs text-ink-muted">PDF / DOCX</p></div>
                )}
              </div>
              {errors.resume && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.resume}</p>}
              {form.resumeFile && (
                <div className="mt-3">
                  <UploadedFileItem file={form.resumeFile} onRemove={() => setForm((p) => ({ ...p, resumeFile: null }))} />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="certDrop" className="label">Certificates <span className="text-ink-muted font-normal">(max 5, optional)</span></label>
            <div {...certDrop.getRootProps()} id="certDrop" className={`mt-2 flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${certDrop.isDragActive ? "border-brand bg-tint-tutor" : errors.certificates ? "border-red-400 bg-red-50" : form.certFiles?.length ? "border-brand bg-tint-tutor" : "border-border bg-white hover:border-brand hover:bg-tint-tutor"} hover:shadow-md`}>
              <input {...certDrop.getInputProps()} className="hidden" />
              <div><p className="text-sm font-medium text-ink">Drop certificates or click</p><p className="text-xs text-ink-muted">PDF / DOCX (max 5)</p></div>
            </div>
            {errors.certificates && <p className="text-sm text-red-600 font-medium">{errors.certificates}</p>}
            {form.certFiles?.length > 0 && (
              <div className="mt-3 grid gap-2">
                {form.certFiles.map((file, idx) => (
                  <UploadedFileItem key={idx} file={file} onRemove={() => setForm((p) => ({ ...p, certFiles: p.certFiles.filter((_, i) => i !== idx) }))} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-label="Agreement" className="border-t border-border pt-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agreePolicy} onChange={(e) => setForm((p) => ({ ...p, agreePolicy: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border text-brand accent-brand" />
            <span className="text-sm-fluid text-ink leading-relaxed">I agree to the <a href="/policy" className="font-semibold text-brand-secondary-strong hover:text-brand underline">Policy</a> and confirm all information is accurate.</span>
          </label>
          {errors.agreePolicy && <p className="text-sm text-red-600 font-medium">{errors.agreePolicy}</p>}
        </section>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          <div className="min-h-[36px]" />
          <div className="flex items-center gap-3">
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-outline rounded-lg px-6 py-2.5 text-sm-fluid" disabled={isLoading}>Cancel</button>
            )}
            <button type="submit" disabled={isLoading} className="btn-brand rounded-lg px-6 py-2.5 text-sm-fluid shadow-sm hover:shadow-md disabled:opacity-60">
              {isLoading ? "Uploading Profile..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
