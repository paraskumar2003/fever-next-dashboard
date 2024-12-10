"use client";
import Image from 'next/image';
import images from "../../utils/constants/images";
import React from 'react';
import { FiMenu } from "react-icons/fi";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import Logout from "./logout";
import { useRouter } from "next/navigation"
import { removeToken } from '@/lib/utils';
import Notiflix from 'notiflix';


interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: NavbarProps) {
    const Loader_Color = 'rgba(241,230,230,0.985)';
    const router = useRouter();
    const handleLogout = () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader       
        console.log("Logout clicked");
        removeToken()
        router.push('/')
        Notiflix.Loading.remove();
    };

    const handleProfile = () => {
        console.log("Profile clicked");
    };
    return (
        <nav
            className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between px-4 z-30 shadow-md transition-all duration-700"

        >
            {/* Logo */}
            <div className="flex items-center justify-between w-56">
                <div className="hidden md:block">
                    <Image
                        src={images.dashboardLogo}
                        alt="Logo"
                        width={100}
                        height={150}
                    />
                </div>
                <button
                    className="text-2xl text-black transition-transform duration-700 ease-in-out transform hover:scale-110"
                    onClick={toggleSidebar}>
                    {!isSidebarOpen ? <FiMenu /> : <AiOutlineMenuUnfold />}
                </button>
            </div>

            {/* User Information */}
            {/* <div className="flex flex-col items-center text-right pr-2">
                <p className="text-sm font-semibold">Name</p>
                <p className="text-xs">User Code</p>
            </div> */}
            <Logout onLogout={handleLogout} onProfile={handleProfile} />

        </nav>
    );
}





