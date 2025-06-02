import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { push } = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [push]);

  if (!isAuthenticated) return null; // Prevents page rendering before auth check

  return children;
};

export default ProtectedRoute;
