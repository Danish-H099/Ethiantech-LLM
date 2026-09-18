import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { m as Motion, useReducedMotion } from "motion/react";
import { getRegionStudents } from "src/services/adminData";
import { TOOLTIP_STYLE } from "src/lib/chartConfig";
import { fadeIn, viewportOnce, easeArrive, createStaggerItem } from "src/lib/animationVariants";

export default function AdminStudentsPage() {
  const regionStudents = getRegionStudents();
  const totalStudents = regionStudents.reduce((sum, r) => sum + r.value, 0);
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Student Analytics</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">Region-wise student distribution across the platform</p>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="card p-6"
        >
          <h2 className="mb-4 text-body-lg font-semibold text-ink">Students by Region</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={regionStudents}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={130}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationDuration={600}
              >
                {regionStudents.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value) => [value.toLocaleString(), "Students"]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={10}
                formatter={(value) => <span className="text-sm-fluid text-ink-muted">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Motion.div>

        <Motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="card p-6"
        >
          <h2 className="mb-4 text-body-lg font-semibold text-ink">Region Breakdown</h2>
          <div className="space-y-5">
            {regionStudents.map((region, i) => {
              const pct = ((region.value / totalStudents) * 100).toFixed(1);
              return (
                <Motion.div
                  key={region.name}
                  custom={i}
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: region.color }} />
                      <span className="text-sm-fluid font-medium text-ink">{region.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm-fluid font-semibold text-ink">{region.value.toLocaleString()}</span>
                      <span className="ml-2 text-sm-fluid text-ink-muted">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <Motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.5, ease: easeArrive }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                  </div>
                </Motion.div>
              );
            })}
          </div>
        </Motion.div>
      </div>
    </div>
  );
}
