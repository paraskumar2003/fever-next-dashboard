"use client";

import Sidebar from "@/components/shared/sidebar";
import React, { useState, useEffect } from "react";
import Header from "@/components/shared/header";

export default function DashboardLayout({
    children }: {
        children: React.ReactNode
    }) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };


        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section>
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex min-h-screen bg-[#EAEEF7] overflow-hidden">
                <div
                    className={`w-[252px] h-screen fixed transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } z-20`}
                >
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
                <main
                    className={` w-full min-h-full px-4 py-10  mt-10 ml-0 overflow-y-auto ${isSidebarOpen ? " md:ml-64" : " md:mx-8"
                        }`}
                >
                    {children}
                </main>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-10 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </section>
    );
}
