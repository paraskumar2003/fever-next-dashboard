"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  CreditCard,
  LineChart,
  BarChart,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FormSection from "@/components/FormSection";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      increasing: true,
      icon: CreditCard,
    },
    {
      title: "New Customers",
      value: "+2,350",
      change: "+180.1%",
      increasing: true,
      icon: UserPlus,
    },
    {
      title: "Active Users",
      value: "12,234",
      change: "+19.4%",
      increasing: true,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-1.3%",
      increasing: false,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-lg transition-shadow duration-200 hover:shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="flex items-center text-sm">
                  <span
                    className={cn(
                      "mr-1 flex items-center",
                      stat.increasing ? "text-accent-600" : "text-red-600",
                    )}
                  >
                    {stat.increasing ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Revenue Overview
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monthly revenue over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center rounded-lg bg-gray-50">
              <LineChart className="h-16 w-16 text-gray-300" />
              <p className="ml-4 text-sm text-gray-500">
                Revenue chart visualization would be displayed here
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-3 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600">
                The last 5 activities in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500">
                        {i} hour{i !== 1 ? "s" : ""} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                User Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">
                User breakdown by region
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[200px] items-center justify-center rounded-lg bg-gray-50">
              <BarChart className="h-12 w-12 text-gray-300" />
              <p className="ml-4 text-sm text-gray-500">
                Distribution chart would be displayed here
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Popular Products
              </CardTitle>
              <CardDescription className="text-gray-600">
                Top selling products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gray-200"></div>
                      <span className="text-sm font-semibold text-gray-900">
                        Product {i}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      ${Math.floor(Math.random() * 100) + 10}.99
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Quick Links
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access frequently used pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {["Data Table", "Multi-Step Form", "Settings", "Help"].map(
                  (link, i) => (
                    <button
                      key={i}
                      className="rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      {link}
                    </button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
