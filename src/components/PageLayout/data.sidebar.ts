import {
  Home,
  Trophy,
  Users,
  Settings,
  HelpCircle,
  FileText,
  Gift,
  Calendar,
  Bell,
  Brain,
  Gamepad2,
  ChartColumnStacked,
  CircleHelp,
} from "lucide-react";

export const menuItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/home",
  },
  {
    id: "category",
    label: "Category",
    icon: ChartColumnStacked,
    path: "/categories",
  },
  {
    id: "questionaire",
    label: "Questionaire",
    icon: CircleHelp,
    path: "/questionaire",
  },
  {
    id: "trivia",
    label: "Trivia",
    icon: Brain,
    children: [
      {
        id: "create-contests",
        label: "Create Contests",
        path: "/trivia",
      },
      {
        id: "upcoming-contests",
        label: "Upcoming Contests",
        path: "/view/trivia?category=upcoming",
      },
      {
        id: "live-contests",
        label: "Live Contests",
        path: "/view/trivia?category=live",
      },
      {
        id: "old-contests",
        label: "Old Contests",
        path: "/view/trivia?category=old",
      },
      {
        id: "draft-contests",
        label: "Draft Contests",
        path: "/view/trivia?category=draft",
      },
    ],
  },
  {
    id: "tambola",
    label: "Tambola",
    icon: HelpCircle, // You can use any icon you prefer for Tambola
    children: [
      {
        id: "upcoming-contests",
        label: "Upcoming Contests",
        path: "/view/tambola",
      },
      {
        id: "live-contests",
        label: "Live Contests",
        path: "/view/tambola",
      },
      {
        id: "old-contests",
        label: "Old Contests",
        path: "/view/tambola",
      },
      {
        id: "draft-contests",
        label: "Draft Contests",
        path: "/view/tambola",
      },
    ],
  },
  {
    id: "wheel-of-fortune",
    label: "Wheel of Fortune",
    icon: Gamepad2, // You can use any icon you prefer for Wheel of Fortune
    children: [
      {
        id: "upcoming-contests",
        label: "Upcoming Contests",
        path: "/view/wheel-of-fortune",
      },
      {
        id: "live-contests",
        label: "Live Contests",
        path: "/view/wheel-of-fortune",
      },
      {
        id: "old-contests",
        label: "Old Contests",
        path: "/view/wheel-of-fortune",
      },
      {
        id: "draft-contests",
        label: "Draft Contests",
        path: "/view/wheel-of-fortune",
      },
    ],
  },

  {
    id: "rewards",
    label: "Rewards",
    icon: Gift,
    path: "/rewards",
  },
];
