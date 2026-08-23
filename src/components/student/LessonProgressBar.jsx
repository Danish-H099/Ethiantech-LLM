import { m as Motion } from "motion/react";
export default function LessonProgressBar({ percentage, label, color, animated = false }) {
  const pct = Math.min(100, Math.max(0, Math.round(percentage || 0)));
  const fillClass = `h-full rounded-full ${color ? "" : "bg-accent-student"} ${
    animated ? "origin-left" : "transition-[width] duration-300 ease-out"
  }`;
  const fillStyle = color
    ? { width: `${pct}%`, backgroundColor: color, transformOrigin: "left" }
    : { width: `${pct}%` };

  const fill = animated ? (
    <Motion.div
      className={fillClass}
      style={fillStyle}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    />
  ) : (
    <div className={fillClass} style={fillStyle} />
  );

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Lesson progress: ${pct}%`}
    >
      {fill}
    </div>
  );
}
