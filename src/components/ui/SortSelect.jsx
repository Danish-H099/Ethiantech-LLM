/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { easeArrive, easeDepart, durations } from "src/lib/animationVariants";
import { parsePrice } from "src/lib/format";

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price Low → High" },
  { value: "price-desc", label: "Price High → Low" },
];

export const sortCourses = (courseList, sortBy) => {
  const sorted = [...courseList];
  switch (sortBy) {
    case "popular":
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "price-desc":
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    default:
      return sorted;
  }
};

export default function SortSelect({ value, onChange, id, ariaLabel = "Sort by" }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const chevronTransition = { duration: shouldReduceMotion ? 0 : durations.modal, ease: easeArrive };

  return (
    <Select.Root value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        className="btn-outline min-h-11 rounded-lg px-4 py-2 text-sm-fluid"
      >
        <Select.Value placeholder="Sort by">
          {SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Sort by"}
        </Select.Value>
        <Select.Icon asChild>
          <Motion.span animate={{ rotate: open ? 180 : 0 }} transition={chevronTransition} aria-hidden="true">
            <ChevronDown size={16} />
          </Motion.span>
        </Select.Icon>
      </Select.Trigger>

      <AnimatePresence>
        {open && (
          <Select.Portal>
            <Select.Content forceMount asChild position="popper" side="bottom" align="start" sideOffset={6}>
              <Motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6, transformOrigin: "top" }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : durations.slow, ease: easeArrive } }}
                exit={{ opacity: 0, scale: 0.96, y: -6, transition: { duration: shouldReduceMotion ? 0 : 0.15, ease: easeDepart } }}
                className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] rounded-xl border border-border bg-white p-1 shadow-dropdown"
              >
                <Select.Viewport className="scrollbar-brand overflow-y-auto">
                  {SORT_OPTIONS.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="flex min-h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm-fluid text-ink outline-none transition-colors duration-hover data-[highlighted]:bg-tint-pink data-[highlighted]:text-brand data-[state=checked]:font-semibold data-[state=checked]:text-brand-strong"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="shrink-0">
                        <Check size={16} aria-hidden="true" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Motion.div>
            </Select.Content>
          </Select.Portal>
        )}
      </AnimatePresence>
    </Select.Root>
  );
}
