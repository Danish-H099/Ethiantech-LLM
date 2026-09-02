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

export function getIcon(iconName) {
  return iconMap[iconName] ?? CircleHelp;
}
