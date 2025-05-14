"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { Suspense, useEffect, useState } from "react";
import { ContestProvider } from "@/context/ContestContext";
import { PageLayout } from "@/components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
