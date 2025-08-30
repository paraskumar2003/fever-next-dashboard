"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { HeaderProps } from "./types";
import Cookies from "js-cookie";

export function Header({ onHambugerClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("authToken");
    router.push("/login");
  };

  return (
    <header className="header flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      {/* Left Icon Button */}
      <button
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        onClick={onHambugerClick}
      >
        <Menu size={28} />
      </button>

      {/* Dropdown Menu */}
      <div className="flex items-center justify-end">


        <button
          className="flex items-center rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          <div className="flex items-center">
            <LogOut size={18} className="mr-2 text-gray-500" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </header>
  );
}
