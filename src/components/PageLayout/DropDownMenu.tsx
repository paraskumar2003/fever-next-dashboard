"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuItem {
  label: string;
  path: string;
}

interface DropdownMenuProps {
  title: string;
  items: MenuItem[];
}

export function DropdownMenu({ title, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative pl-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-1 flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
      >
        {title} <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-1 mt-2 w-48 rounded-lg bg-white text-black shadow-lg">
          <ul className="py-2">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 hover:bg-gray-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
