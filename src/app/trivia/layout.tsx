"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { Suspense, useEffect, useState } from "react";
import { ContestProvider } from "@/context/ContestContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <ContestProvider>
            <div className="h-screen dark:bg-boxdark-2 dark:text-bodydark">
              {children}
            </div>
          </ContestProvider>
        </body>
      </html>
    </Suspense>
  );
}
