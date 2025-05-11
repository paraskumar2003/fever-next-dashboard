import React from "react";
import clsx from "clsx";

interface SubscriptionBadgeProps {
  level: "premium" | "intermediate" | "beginner";
  text: string;
}

const levelGradients = {
  premium: "from-yellow-400 via-yellow-300 to-yellow-500",
  intermediate: "from-gray-400 via-gray-300 to-gray-500",
  beginner: "from-orange-400 via-orange-300 to-orange-500",
};

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  level,
  text,
}) => {
  const gradient = levelGradients[level] || levelGradients.beginner;

  return (
    <div
      className={clsx(
        "rounded-full px-3 py-1 py-2 text-center text-sm font-semibold text-white shadow-lg",
        `bg-gradient-to-r ${gradient}`,
      )}
    >
      {text}
    </div>
  );
};

export { SubscriptionBadge };
