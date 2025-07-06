"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { Suspense, useEffect, useState } from "react";
import { ContestProvider } from "@/context/ContestContext";
import { PageLayout } from "@/components";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token in cookies
    const token = Cookies.get("authToken");
    
    if (!token) {
      // No token found, redirect to login
      router.push("/login");
      return;
    }
    
    // Token found, user is authenticated
    setIsAuthenticated(true);
    setTimeout(() => setLoading(false), 1000);
  }, [router]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContestProvider>
        <PageLayout>
          <div className="h-screen dark:bg-boxdark-2 dark:text-bodydark">
            {children}
          </div>
        </PageLayout>
      </ContestProvider>
    </Suspense>
  );
}
