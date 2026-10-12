import { useRef, useState } from "react";
import { Check, Paperclip, Upload, X } from "lucide-react";
// Shared constants live in wizardFieldMeta.js — react-refresh requires that a
// file exporting components exports nothing else.
import { FIELD_LABEL } from "src/components/tutor/onboarding/wizardFieldMeta";

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-sm-fluid text-error">{children}</p>;
}

/**
 * Click-or-drop file input used across wizard steps (photo, CV, ID, degrees,
 * certificates, authorization letters). Shows an attached-file chip with a
 * remove action once a file is picked; file objects stay in the wizard's
 * local state — only the file name is ever persisted.
 */
export function FileDropzone({
  id,
  accept,
  label,
  hint,
  fileName,
  previewUrl,
  onFile,
  onClear,
  error,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  }

  if (fileName) {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 ${
          error ? "border-error" : "border-border"
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-soft text-accent-tutor">
            <Paperclip size={15} />
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-sm-fluid font-medium text-ink">
          {fileName}
        </p>
        <button
          type="button"
          onClick={onClear}
          aria-label={`Remove ${fileName}`}
          className="shrink-0 rounded p-1 text-ink-muted transition hover:text-error"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        id={id}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
          isDragging
            ? "border-accent-tutor bg-tint-tutor"
            : error
              ? "border-error bg-error-soft/40"
              : "border-border bg-surface-soft hover:border-accent-tutor hover:bg-tint-tutor"
        }`}
      >
        <Upload size={18} className="text-accent-tutor" />
        <span className="text-sm-fluid font-medium text-ink">{label}</span>
        {hint && <span className="text-sm-fluid text-ink-muted">{hint}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/** Multi-select chip row (teaching subjects). Buttons carry aria-pressed. */
export function ToggleChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(option)}
            className={`category-quick-chip ${isActive ? "category-quick-chip-active" : ""}`}
          >
            {isActive && <Check size={13} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** Single-choice pill group backed by real radio inputs (identity document type). */
export function RadioPillGroup({ legend, name, options, value, onChange, error }) {
  return (
    <fieldset>
      <legend className={FIELD_LABEL}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`category-quick-chip cursor-pointer focus-within:ring-2 focus-within:ring-brand ${
              value === option.value ? "category-quick-chip-active" : ""
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError>{error}</FieldError>
    </fieldset>
  );
}
