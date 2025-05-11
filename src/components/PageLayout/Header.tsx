"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { HeaderProps } from "./types";

export function Header({ onHambugerClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="header flex items-center justify-between bg-gray-900 px-6 py-4 text-white shadow-md">
      {/* Left Icon Button */}
      <button
        className="rounded-md p-2 hover:bg-gray-800"
        onClick={onHambugerClick}
      >
        <Menu size={28} />
      </button>

      {/* Dropdown Menu */}
      <div className="flex items-center justify-end">
        {/* Dropdown Menu */}

        {/* <DropdownMenu
          title="View Contest"
          items={[
            { label: "Wheel of Fortune", path: "/view/wheel-of-fortune" },
            { label: "Tambola", path: "/view/tambola" },
            { label: "Trivia", path: "/view/trivia" },
          ]}
        /> */}

        {/* <DropdownMenu
          title="Create Contest"
          items={[
            { label: "Wheel of Fortune", path: "/wheel-of-fortune" },
            { label: "Tambola", path: "/tambola" },
            { label: "Trivia", path: "/trivia" },
          ]}
        /> */}
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          <div className="flex items-center justify-around pl-8">
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </header>
  );
}
