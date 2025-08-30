"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { Suspense, useEffect, useState } from "react";
import { ContestProvider } from "@/context/ContestContext";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import { PageLayout } from "@/components";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import Loader from "@/components/Loader";
import { setGlobalLoadingHandler } from "@/services/interceptor.base";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    setGlobalLoadingHandler(setLoading);
  }, [setLoading]);

  return (
    <>
      <PageLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2 dark:text-bodydark">
          {children}
        </div>
      </PageLayout>
      <Loader isLoading={isLoading} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </>
  );
}
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader isLoading={true} overlay={false} />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingProvider>
        <ContestProvider>
          <LayoutContent>{children}</LayoutContent>
        </ContestProvider>
      </LoadingProvider>
    </Suspense>
  );
}
