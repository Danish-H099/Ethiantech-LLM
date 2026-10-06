import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { getAdminStats } from "src/services/adminData";
import { CHART_ACCENTS } from "src/lib/chartConfig";
import DashboardStatCard from "src/components/ui/DashboardStatCard";
import { viewportOnce, createStaggerItem } from "src/lib/animationVariants";

export default function AdminDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const statCards = getAdminStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">Overview of your platform performance</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => {
          const accent = CHART_ACCENTS[i];
          return (
            <Motion.div
              key={card.label}
              custom={i}
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <DashboardStatCard
                label={card.label}
                value={card.value}
                change={card.change}
                up={card.up}
                accent={accent}
                iconName={card.iconName}
              />
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
}
