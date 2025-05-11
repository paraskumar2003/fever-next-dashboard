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
} from "lucide-react";

export const menuItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/home",
  },
  {
    id: "trivia",
    label: "Trivia",
    icon: Brain,
    children: [
      {
        id: "questionaire",
        label: "Questionaire",
        path: "/trivia/questionaire",
      },
      {
        id: "create-contests",
        label: "Create Contests",
        path: "/test-view",
      },
      {
        id: "upcoming-contests",
        label: "Upcoming Contests",
        path: "/view/trivia",
      },
      {
        id: "live-contests",
        label: "Live Contests",
        path: "/view/trivia",
      },
      {
        id: "old-contests",
        label: "Old Contests",
        path: "/view/trivia",
      },
      {
        id: "draft-contests",
        label: "Draft Contests",
        path: "/view/trivia",
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
