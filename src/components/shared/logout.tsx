'use client'
import React, { useState, useEffect, useRef } from "react";
import { RdIcon } from "./icons";
import { getRole } from "@/lib/utils";

interface DropdownProps {
    onLogout: () => void;
    onProfile: () => void;
}

const Logout: React.FC<DropdownProps> = ({ onLogout, onProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [storeRole, setStoreRole] = useState<string | null>(null);

    useEffect(() => {
        const role = getRole();
        setStoreRole(role);
    }, []);
    // console.log(storeRole, 2342)

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex justify-between  h-10 px-4 items-center text-right  cursor-pointer"
                onClick={toggleDropdown}
            >
                <span> <RdIcon iconName="profile"
                    iconclasses={["text-orange-500 ", "mr-3", "text-[32px]"]} // Tailwind classes for styling
                /> </span>
                <p className="text-[16px] font-medium">{storeRole}</p>
                {/* <p className="text-xs">User Code</p> */}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-40">
                    <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={onProfile}
                    >
                        Profile
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Logout;
