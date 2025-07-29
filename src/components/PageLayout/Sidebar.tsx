import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem, SidebarProps } from "./types";

interface SideBarProps {
  isOpen: boolean;
  onClose?: () => void;
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  menuItems,
}: SideBarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

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
    const isActive = item.path === pathname;
    const hasActiveChild =
      hasChildren &&
      item.children?.some(
        (child) =>
          child.path === pathname ||
          (child.children &&
            child.children.some((grandChild) => grandChild.path === pathname)),
      );
    const shouldExpand = isExpanded || hasActiveChild;

    return (
      <div key={item.id} className="w-full">
        {item.path ? (
          <Link
            href={item.path}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              level > 0 ? "ml-4" : ""
            } ${
              isActive
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={onClose}
          >
            {item.icon && (
              <span className={isActive ? "text-white" : "text-blue-900"}>
                {React.createElement(item.icon, { className: "h-5 w-5" })}
              </span>
            )}
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => toggleExpand(item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-2 transition-colors ${
              level > 0 ? "ml-4" : ""
            } ${
              hasActiveChild
                ? "bg-primary-50 text-primary-800 hover:bg-primary-100"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                <span
                  className={hasActiveChild ? "text-primary-800" : "text-gray-600"}
                >
                  {React.createElement(item.icon, { className: "h-5 w-5" })}
                </span>
              )}
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            {hasChildren &&
              (shouldExpand ? (
                <ChevronDown
                  className={`h-4 w-4 ${hasActiveChild ? "text-primary-800" : "text-gray-600"}`}
                />
              ) : (
                <ChevronRight
                  className={`h-4 w-4 ${hasActiveChild ? "text-primary-800" : "text-gray-600"}`}
                />
              ))}
          </button>
        )}

        {hasChildren && shouldExpand && (
          <div className="ml-4 border-l border-gray-200 pl-2">
            {item?.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Auto-expand parent items that have active children on component mount
  React.useEffect(() => {
    const findParentWithActiveChild = (items: MenuItem[]): string[] => {
      const parentsToExpand: string[] = [];

      const checkItem = (item: MenuItem) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) =>
              child.path === pathname ||
              (child.children &&
                child.children.some(
                  (grandChild) => grandChild.path === pathname,
                )),
          );

          if (hasActiveChild) {
            parentsToExpand.push(item.id);
          }

          // Recursively check children
          item.children.forEach(checkItem);
        }
      };

      items.forEach(checkItem);
      return parentsToExpand;
    };

    const parentsToExpand = findParentWithActiveChild(menuItems);
    if (parentsToExpand.length > 0) {
      setExpandedItems((prev) => [...new Set([...prev, ...parentsToExpand])]);
    }
  }, [pathname, menuItems]);

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
        } border-r border-gray-200`}
      >
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="mb-8 px-2">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
