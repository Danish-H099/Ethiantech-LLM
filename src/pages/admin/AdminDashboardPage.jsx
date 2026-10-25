import { useEffect, useMemo, useState } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { CHART_ACCENTS } from "src/lib/chartConfig";
import DashboardStatCard from "src/components/ui/DashboardStatCard";
import { viewportOnce, createStaggerItem, fadeIn } from "src/lib/animationVariants";
import { fetchAdminDashboardOverview } from "src/services/adminApproval";

function formatCurrency(value, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
  } catch {
    return `$${Number(value ?? 0).toLocaleString()}`;
  }
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString();
}

function formatChange(growth, isPercentage = true) {
  const num = Number(growth ?? 0);
  const sign = num >= 0 ? "+" : "";
  if (isPercentage) {
    return `${sign}${num}%`;
  }
  return `${sign}${num}`;
}

function mapOverviewToCards(overview = {}) {
  const totalRevenue = overview.totalRevenue ?? {};
  const totalStudents = overview.totalStudents ?? {};
  const activeCourses = overview.activeCourses ?? {};
  const newEnrollments = overview.newEnrollments ?? {};

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue.value, totalRevenue.currency || "USD"),
      change: formatChange(totalRevenue.growth, true),
      up: Number(totalRevenue.growth ?? 0) >= 0,
      iconName: "TrendingUp",
    },
    {
      label: "Total Students",
      value: formatNumber(totalStudents.value),
      change: formatChange(totalStudents.growth, true),
      up: Number(totalStudents.growth ?? 0) >= 0,
      iconName: "Users",
    },
    {
      label: "Active Courses",
      value: formatNumber(activeCourses.value),
      change: formatChange(activeCourses.growth, false),
      up: Number(activeCourses.growth ?? 0) >= 0,
      iconName: "BookOpen",
    },
    {
      label: "New Enrollments",
      value: formatNumber(newEnrollments.value),
      change: formatChange(newEnrollments.growth, true),
      up: Number(newEnrollments.growth ?? 0) >= 0,
      iconName: "UserPlus",
    },
  ];

  return cards;
}

export default function AdminDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview() {
    try {
      setLoading(true);
      setError("");
      const overview = await fetchAdminDashboardOverview();
      setStatCards(mapOverviewToCards(overview));
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="mt-1 text-sm-fluid text-ink-muted">Overview of your platform performance</p>
      </div>

      {loading ? (
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="card flex items-center justify-center gap-2 px-6 py-12 text-ink-muted"
        >
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm-fluid">Loading dashboard data...</span>
        </Motion.div>
      ) : error ? (
        <Motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="card flex flex-col items-center gap-3 px-6 py-12 text-center"
        >
          <p className="font-semibold text-ink">Failed to load</p>
          <p className="max-w-sm text-sm-fluid text-ink-muted">{error}</p>
          <button type="button" onClick={loadOverview} className="btn-brand mt-2 px-4 py-2 text-sm-fluid">
            Retry
          </button>
        </Motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card, i) => {
            const accent = CHART_ACCENTS[i % CHART_ACCENTS.length];
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
      )}
    </div>
  );
}
