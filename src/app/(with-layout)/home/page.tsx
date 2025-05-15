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
import { PageLayout } from "@/components";
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
    <PageLayout>
      <FormSection title="Overview">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-muted-foreground flex items-center text-xs">
                    <span
                      className={cn(
                        "mr-1 flex items-center",
                        stat.increasing ? "text-emerald-500" : "text-red-500",
                      )}
                    >
                      {stat.increasing ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <LineChart className="text-muted-foreground/50 h-16 w-16" />
                <p className="text-muted-foreground ml-4 text-sm">
                  Revenue chart visualization would be displayed here
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  The last 5 activities in your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          New user registered
                        </p>
                        <p className="text-muted-foreground text-xs">
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
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>User breakdown by region</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[200px] items-center justify-center">
                <BarChart className="text-muted-foreground/50 h-12 w-12" />
                <p className="text-muted-foreground ml-4 text-sm">
                  Distribution chart would be displayed here
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Products</CardTitle>
                <CardDescription>
                  Top selling products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted h-8 w-8 rounded"></div>
                        <span className="text-sm font-medium">Product {i}</span>
                      </div>
                      <span className="text-sm font-medium">
                        ${Math.floor(Math.random() * 100) + 10}.99
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Access frequently used pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {["Data Table", "Multi-Step Form", "Settings", "Help"].map(
                    (link, i) => (
                      <button
                        key={i}
                        className="hover:bg-muted rounded-md border p-2 text-sm transition-colors"
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
      </FormSection>
    </PageLayout>
  );
}
