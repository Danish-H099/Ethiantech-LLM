import { useState, useRef } from "react";
import { Save, Upload, X, Check, Image, FileText, Briefcase, Award, ShieldCheck } from "lucide-react";

export default function TutorProfilePage() {
  const [form, setForm] = useState({
    fullName: "", headline: "", about: "", age: "", gender: "",
    photoName: "", photoPreview: null, resumeName: "",
    nationality: "", certName: "", agreePolicy: false,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const photoRef = useRef(null); const resumeRef = useRef(null); const certRef = useRef(null);

  function setField(k, v) {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  }

  function handlePhoto(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { setErrors(p => ({ ...p, photo: "Image must be under 2MB." })); return; }
    setField("photoName", file.name);
    const r = new FileReader(); r.onload = e => setField("photoPreview", e.target.result); r.readAsDataURL(file);
  }
  function handleResume(file) { if (file) setField("resumeName", file.name); }

  function wordCount(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }
  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    const hw = wordCount(form.headline);
    if (!form.headline.trim()) e.headline = "Headline is required.";
    else if (hw > 5) e.headline = `Headline must be 5 words or less (${hw} words).`;
    const aw = wordCount(form.about);
    if (!form.about.trim()) e.about = "About you is required.";
    else if (aw > 80) e.about = `About must be 80 words or less (${aw} words).`;
    if (!form.age.trim()) e.age = "Age is required.";
    else if (Number(form.age) < 1 || Number(form.age) > 120) e.age = "Enter a valid age.";
    if (!form.gender) e.gender = "Gender is required.";
    if (!form.photoName) e.photo = "Profile image is required.";
    if (!form.resumeName) e.resume = "Resume is required.";
    if (!form.nationality.trim()) e.nationality = "Nationality is required.";
    if (!form.agreePolicy) e.agreePolicy = "You must agree to the policy.";
    return e;
  }

  function onSubmit(e) {
    e.preventDefault(); const errs = validate(); setErrors(errs);
    if (!Object.keys(errs).length) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Tutor Profile</h1>
        <p className="mt-2 text-subtitle text-ink-muted">Keep your public profile sharp. Only these fields are shown to students.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {/* Section: Basic identity */}
        <section className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">Tutor&apos;s Full Name</label>
              <input id="fullName" type="text" value={form.fullName} onChange={e => setField("fullName", e.target.value)} placeholder="e.g. Amina Bekele" className={`input ${errors.fullName ? "border-error" : ""}`} />
              {errors.fullName && <p className="mt-1.5 text-sm-fluid text-error">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="headline" className="label">Headline <span className="text-ink-muted font-normal">(max 5 words)</span></label>
              <input id="headline" type="text" value={form.headline} onChange={e => setField("headline", e.target.value)} placeholder="e.g. Senior Cloud Architect" className={`input ${errors.headline ? "border-error" : ""}`} />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                {errors.headline ? <p className="text-sm-fluid text-error">{errors.headline}</p> : <span className={`text-xs font-medium ${wordCount(form.headline) > 5 ? "text-error" : "text-ink-muted"}`}>{wordCount(form.headline)} / 5 words</span>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="about" className="label">About You <span className="text-ink-muted font-normal">(max 80 words)</span></label>
            <textarea id="about" rows={4} value={form.about} onChange={e => setField("about", e.target.value)} placeholder="What do you teach, and what practical experience do you bring to it?" className={`input resize-none py-2.5 ${errors.about ? "border-error" : ""}`} />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              {errors.about ? <p className="text-sm-fluid text-error">{errors.about}</p> : <span className={`text-xs font-medium ${wordCount(form.about) > 80 ? "text-error" : "text-ink-muted"}`}>{wordCount(form.about)} / 80 words</span>}
            </div>
          </div>
        </section>

        {/* Section: Demographics */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="age" className="label">Age</label>
            <input id="age" type="number" min={18} max={120} value={form.age} onChange={e => setField("age", e.target.value)} placeholder="e.g. 28" className={`input ${errors.age ? "border-error" : ""}`} />
            {errors.age && <p className="mt-1.5 text-sm-fluid text-error">{errors.age}</p>}
          </div>
          <div>
            <label htmlFor="gender" className="label">Gender</label>
            <select id="gender" value={form.gender} onChange={e => setField("gender", e.target.value)} className={`input ${errors.gender ? "border-error" : ""}`}>
              <option value="">Select gender</option>
              {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.gender && <p className="mt-1.5 text-sm-fluid text-error">{errors.gender}</p>}
          </div>
            <div>
              <label htmlFor="nationality" className="label">Nationality</label>
              <input id="nationality" type="text" value={form.nationality} onChange={e => setField("nationality", e.target.value)} placeholder="e.g. Ethiopian" className={`input ${errors.nationality ? "border-error" : ""}`} />
              {errors.nationality && <p className="mt-1.5 text-sm-fluid text-error font-medium">{errors.nationality}</p>}
            </div>
        </section>

        {/* Section: Media uploads */}
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="label mb-0">Profile Image <span className="text-ink-muted font-normal">(max 2MB)</span></h3>
            <div className="mt-2">
              {form.photoPreview ? (
                <div className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-4 shadow-sm">
                  <img src={form.photoPreview} alt="Preview" className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-brand/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{form.photoName}</p>
                    <button type="button" onClick={() => { setField("photoName", ""); setField("photoPreview", null); }} className="mt-2 inline-flex items-center gap-1 rounded-full bg-error-soft text-error hover:bg-error/10 px-2.5 py-0.5 text-xs font-semibold transition"><X size={12} /> Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => photoRef.current?.click()} className={`group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-center transition ${errors.photo ? "border-error bg-error-soft/20" : "border-border bg-surface-soft hover:border-brand hover:bg-tint-tutor hover:shadow-md"}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border group-hover:ring-brand/30 transition"><Image size={20} className="text-brand" /></span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Click to upload photo</p>
                    <p className="text-xs text-ink-muted">JPG or PNG — up to 2MB</p>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = ""; }} />
                </button>
              )}
            </div>
            {errors.photo && <p className="mt-2 text-sm-fluid text-error font-medium">{errors.photo}</p>}
          </div>

          <div>
              <h3 className="label mb-0">Resume</h3>
              <div className="mt-2">
                {form.resumeName ? (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                    <FileText size={16} className="text-brand shrink-0" />
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{form.resumeName}</p>
                    <button type="button" onClick={() => setField("resumeName", "")} aria-label="Remove resume" className="shrink-0 rounded-full p-1 text-ink-muted hover:text-error hover:bg-error-soft transition"><X size={16} /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => resumeRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-surface-soft px-4 py-5 text-center transition hover:border-brand hover:bg-tint-tutor hover:shadow-md">
                    <Briefcase size={18} className="text-brand" />
                    <span className="text-sm font-medium text-ink">Upload resume</span>
                    <span className="text-xs text-ink-muted">PDF / DOCX</span>
                    <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleResume(f); e.target.value = ""; }} />
                  </button>
                )}
              </div>
              {errors.resume && <p className="mt-2 text-sm-fluid text-error font-medium">{errors.resume}</p>}

          </div>
        </section>

        {/* Section: Certifications */}
        <section>
          <h3 className="label mb-0">Certificate / Licenses <span className="text-ink-muted font-normal">(optional)</span></h3>
          <div className="mt-2">
            {form.certName ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <Award size={16} className="text-brand-secondary-strong shrink-0" />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{form.certName}</p>
                <button type="button" onClick={() => setField("certName", "")} aria-label="Remove certificate" className="shrink-0 rounded-full p-1 text-ink-muted hover:text-error hover:bg-error-soft transition"><X size={16} /></button>
              </div>
            ) : (
              <button type="button" onClick={() => certRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-soft px-6 py-6 text-center transition hover:border-brand hover:bg-tint-tutor hover:shadow-md">
                <Award size={20} className="text-brand-secondary-strong" />
                <span className="text-sm font-medium text-ink">Upload certificate</span>
                <span className="text-xs text-ink-muted">Optional — PDF / DOCX</span>
                <input ref={certRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setField("certName", f.name); e.target.value = ""; }} />
              </button>
            )}
          </div>
        </section>

        {/* Section: Policy */}
        <section>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agreePolicy} onChange={e => setField("agreePolicy", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border text-brand focus:ring-brand accent-brand" />
            <span className="text-sm-fluid text-ink leading-relaxed">I agree to the <a href="/policy" className="font-semibold text-brand-secondary-strong hover:text-brand underline underline-offset-2 transition">Policy</a> and confirm all information is accurate.</span>
          </label>
          {errors.agreePolicy && <p className="mt-2 text-sm-fluid text-error font-medium">{errors.agreePolicy}</p>}
        </section>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          <div className="min-h-[36px]">
            {saved && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm-fluid font-medium text-success shadow-sm">
                <Check size={14} /> Saved
              </span>
            )}
          </div>
          <button type="submit" className="btn-brand rounded-lg px-6 py-2.5 text-sm-fluid shadow-sm hover:shadow-md hover:-translate-y-px transition active:translate-y-0">
            <Save size={16} /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
