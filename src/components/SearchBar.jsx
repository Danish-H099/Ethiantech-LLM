import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ search, onSearch, className }) {
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-xl border border-border bg-white py-1 pl-3 pr-1 shadow-sm transition focus-within:border-brand ${className ?? ""}`}
    >
      <Search size={18} className="shrink-0 text-ink-muted/70" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search courses"
        aria-label="Search courses"
        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink-muted"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          aria-label="Clear search"
          className="shrink-0 rounded p-1 text-ink-muted/70 transition hover:text-ink"
        >
          <X size={16} />
        </button>
      )}
      <button type="submit" className="btn-brand btn-brand-flat shrink-0 rounded-lg px-4 py-1.5 text-sm-fluid">
        Search
      </button>
    </form>
  );
}
