import { NextResponse } from "next/server"
import type { NextRequest } from "next/server";

// Middleware to handle route protection based on token and role
export function middleware(request: NextRequest) {
    const urlPath = request.nextUrl.pathname;
    console.log("url", urlPath)

    // Get the accessToken and userType from cookies
    const tokenCookie = request.cookies.get("accessToken")?.value;
    const roleCookie = request.cookies.get("role")?.value;

    console.log("Token Cookie:", tokenCookie);
    console.log("Role Cookie:", roleCookie);


    // If the token is missing, redirect to the login page for all protected routes
    if (!tokenCookie) {
        // Allow access to the login page
        if (urlPath !== "/") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // If the user is logged in (token exists), prevent access to the login page
    if (urlPath === "/" && tokenCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (roleCookie) {
        const userRole = roleCookie;

        // Define routes for each role
        const procurementRoutes = ["/dashboard", "/dashboard/client"];
        const vendorRoutes = ["/dashboard", "/dashboard/client"];
        // const SuperAdminRoutes = ["/dashboard",];

        if (userRole === "super_admin") {
            console.log("Super Admin Access Granted!");
            return NextResponse.next(); // Allow access to all routes
        }

        let _protected = false;

        // Check role and assign routes accordingly
        if (userRole === "procurement") {
            console.log("Role Procurement..!!")
            _protected = procurementRoutes.includes(urlPath);

        } else if (userRole === "vendor") {
            console.log("Role Vendor..!!")
            _protected = vendorRoutes.includes(urlPath);

        }

        console.log(_protected, urlPath)

        // Handle the response
        if (_protected) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    return NextResponse.next();

    // If everything is fine, let the request proceed
}

// Apply this middleware to specific routes
export const config = {
    matcher: ["/dashboard/:path*"]
}

