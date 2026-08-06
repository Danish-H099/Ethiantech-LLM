import { TrendingUp, Users, BookOpen, UserPlus } from "lucide-react";
import { statCards } from "../../data/adminData";
import { CHART_ACCENTS } from "../../data/chartColors";

const icons = [TrendingUp, Users, BookOpen, UserPlus];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Overview of your platform performance
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = icons[i];
          const accent = CHART_ACCENTS[i];
          return (
            <div
              key={card.label}
              className="card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-13 font-medium"
                  style={{
                    backgroundColor: card.up ? "#DCFCE7" : "#FEE2E2",
                    color: card.up ? "#16A34A" : "#DC2626",
                  }}
                >
                  {card.change}
                </span>
              </div>
              <p className="text-sm text-ink-muted">{card.label}</p>
              <p className="mt-1 page-title">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
