import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MenuItem, SidebarProps } from "./types";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, menuItems }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} className="w-full">
        {item.path ? (
          <Link
            href={item.path}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-blue-900 hover:bg-gray-100 ${
              level > 0 ? "ml-4" : ""
            }`}
            onClick={onClose}
          >
            {item.icon && (
              <span className="text-blue-900">
                {React.createElement(item.icon, { className: "h-5 w-5" })}
              </span>
            )}
            <span className="text-md font-bold">{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => toggleExpand(item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-blue-900 hover:bg-gray-100 ${
              level > 0 ? "ml-4" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                <span className="text-blue-900">
                  {React.createElement(item.icon, { className: "h-5 w-5" })}
                </span>
              )}
              <span className="text-md font-bold">{item.label}</span>
            </div>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4 text-blue-900" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-900" />
              ))}
          </button>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-blue-100 pl-2">
            {item?.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* {isOpen && (
        <div
          className="fixed inset-0 z-40 flex-1 bg-black/0"
          onClick={onClose}
        />
      )} */}
      <div
        className={`sidebar z-50 max-h-screen w-[250px] transform bg-white shadow-md transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
