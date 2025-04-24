"use client";

import { RdIcon } from "./icons";

type Node = {
  name: string;
  url: string;
  nodes?: Node[];
  icon?: JSX.Element;
};

export const nodes: Node[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: <RdIcon iconName="homeicon" />, // this is imported icon component
  },
  {
    name: "Spin The Wheel",
    url: "",
    icon: <RdIcon iconName="userfriends" />,
    nodes: [
      {
        name: "Contests",
        url: "/dashboard/spinthewheel",
        icon: <RdIcon iconName="dot" />,
      },
      {
        name: "Participated Users",
        url: "/dashboard/spinthewheel/participated-users",
        icon: <RdIcon iconName="dot" />,
      },
    ],
  },
  {
    name: "Tambola Anytime",
    url: "",
    icon: <RdIcon iconName="userfriends" />,
    nodes: [
      {
        name: "Contests",
        url: "/dashboard/tambola-anytime",
        icon: <RdIcon iconName="dot" />,
      },
      {
        name: "Participated Users",
        url: "/dashboard/tambola-anytime/participated-users",
        icon: <RdIcon iconName="dot" />,
      },
    ],
  },
  {
    name: "Tambola Live",
    url: "",
    icon: <RdIcon iconName="userfriends" />,
    nodes: [
      {
        name: "Contests",
        url: "/dashboard/tambola-live",
        icon: <RdIcon iconName="dot" />,
      },
      {
        name: "Participated Users",
        url: "/dashboard/tambola-live/participated-users",
        icon: <RdIcon iconName="dot" />,
      },
    ],
  },
  {
    name: "Trivia",
    url: "",
    icon: <RdIcon iconName="userfriends" />,
    nodes: [
      {
        name: "Contests",
        url: "/dashboard/trivia",
        icon: <RdIcon iconName="dot" />,
      },
      {
        name: "Questions",
        url: "/dashboard/trivia/questions",
        icon: <RdIcon iconName="dot" />,
      },
      {
        name: "Participated Users",
        url: "/dashboard/trivia/participated-users",
        icon: <RdIcon iconName="dot" />,
      },
    ],
  },
];
