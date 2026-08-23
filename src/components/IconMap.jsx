import {
  CircleHelp,
  DollarSign,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Clock,
  StickyNote,
  TrendingUp,
  UserPlus,
} from "lucide-react";

/**
 * Registry mapping serializable icon names (used in mock data) to their
 * Lucide components. Keeps data files free of component references so the
 * boundary between data and presentation stays clean.
 */
const iconMap = {
  DollarSign,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Clock,
  StickyNote,
  TrendingUp,
  UserPlus,
};

/**
 * Resolve an icon name to a Lucide component. Unknown names fall back to a
 * neutral help icon so a stale/missing name can never crash the render.
 *
 * @param {string} iconName
 * @returns {object}
 */
export function getIcon(iconName) {
  return iconMap[iconName] ?? CircleHelp;
}
