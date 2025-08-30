import React from "react";

export default function ListWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="scrollbar-none max-h-[75vh] overflow-scroll">
      {children}
    </div>
  );
}
