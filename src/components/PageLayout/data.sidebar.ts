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
  FileQuestion,
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
    id: "question-sets",
    label: "Question Sets",
    icon: FileQuestion,
    path: "/question-sets",
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
        path: "/view/trivia/upcoming",
      },
      {
        id: "live-contests",
        label: "Live Contests",
        path: "/view/trivia/live",
      },
      {
        id: "old-contests",
        label: "Old Contests",
        path: "/view/trivia/old",
      },
      {
        id: "draft-contests",
        label: "Draft Contests",
        path: "/view/trivia/draft",
      },
    ],
  },
  // {
  //   id: "tambola",
  //   label: "Tambola",
  //   icon: HelpCircle, // You can use any icon you prefer for Tambola
  //   children: [
  //     {
  //       id: "upcoming-contests",
  //       label: "Upcoming Contests",
  //       path: "/view/tambola",
  //     },
  //     {
  //       id: "live-contests",
  //       label: "Live Contests",
  //       path: "/view/tambola",
  //     },
  //     {
  //       id: "old-contests",
  //       label: "Old Contests",
  //       path: "/view/tambola",
  //     },
  //     {
  //       id: "draft-contests",
  //       label: "Draft Contests",
  //       path: "/view/tambola",
  //     },
  //   ],
  // },
  // {
  //   id: "wheel-of-fortune",
  //   label: "Wheel of Fortune",
  //   icon: Gamepad2, // You can use any icon you prefer for Wheel of Fortune
  //   children: [
  //     {
  //       id: "upcoming-contests",
  //       label: "Upcoming Contests",
  //       path: "/view/wheel-of-fortune",
  //     },
  //     {
  //       id: "live-contests",
  //       label: "Live Contests",
  //       path: "/view/wheel-of-fortune",
  //     },
  //     {
  //       id: "old-contests",
  //       label: "Old Contests",
  //       path: "/view/wheel-of-fortune",
  //     },
  //     {
  //       id: "draft-contests",
  //       label: "Draft Contests",
  //       path: "/view/wheel-of-fortune",
  //     },
  //   ],
  // },

  {
    id: "rewards-management",
    label: "Manage Rewards",
    icon: Gift,
    children: [
      {
        id: "rewards",
        label: "Rewards",
        path: "/rewards-management/rewards",
      },
      {
        id: "coupons",
        label: "Coupons",
        path: "/rewards-management/coupons",
      },
    ],
  },
];
