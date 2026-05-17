import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LayoutDashboard,
  List,
  Mic,
  Radio,
  Settings,
  User2,
  Users,
  UsersRound,
  WalletCards,
  Plug,
  Shield,
} from "lucide-react";

/**
 * Main sidebar navigation — maps current app routes + future modules.
 */
export const SideBarOptions = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: Briefcase,
    children: [
      { name: "Active Jobs", icon: ClipboardList, path: "/jobs/active" },
      { name: "Drafts", icon: FileText, path: "/jobs/drafts" },
      { name: "Closed", icon: Briefcase, path: "/jobs/closed" },
    ],
  },
  {
    id: "candidates",
    name: "Candidates",
    icon: Users,
    children: [
      { name: "All Candidates", icon: UsersRound, path: "/candidates" },
      { name: "By Job", icon: List, path: "/candidates/by-job" },
    ],
  },
  {
    id: "interviews",
    name: "Interviews",
    icon: Mic,
    children: [
      { name: "Scheduled", icon: Calendar, path: "/interviews/scheduled" },
      { name: "Live Now", icon: Radio, path: "/interviews/live", pulse: true },
      { name: "Completed", icon: ClipboardList, path: "/interviews/completed" },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    children: [
      { name: "Hiring Pipeline", icon: BarChart3, path: "/reports/pipeline" },
      { name: "Team Performance", icon: UsersRound, path: "/reports/team-performance" },
      { name: "Cost Per Hire", icon: CircleDollarSign, path: "/reports/cost-per-hire" },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Team & Roles", icon: Shield, path: "/settings/team" },
      { name: "Billing & Plan", icon: WalletCards, path: "/billing" },
      { name: "Company Profile", icon: Building2, path: "/settings/company" },
      { name: "Integrations", icon: Plug, path: "/integrations" },
      { name: "App Preferences", icon: User2, path: "/settings" },
    ],
  },
];

export function isPathActive(pathname, path) {
  if (path === "/dashboard") return pathname === "/dashboard";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isGroupActive(pathname, group) {
  if (group.path) return isPathActive(pathname, group.path);
  return group.children?.some((child) => isPathActive(pathname, child.path));
}

export function getInitiallyOpenGroups(pathname) {
  const open = {};
  SideBarOptions.forEach((group) => {
    if (group.children?.length) {
      open[group.id] = isGroupActive(pathname, group);
    }
  });
  return open;
}
