import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { push } = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get token from cookies instead of localStorage
    const token = Cookies.get("authToken");
    
    if (!token) {
      push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [push]);

  if (!isAuthenticated) return null; // Prevents page rendering before auth check

  return children;
};

export default ProtectedRoute;
