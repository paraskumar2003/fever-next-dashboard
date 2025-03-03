import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fever | Control Panel",
  description: "",
};

export default function Home() {
  redirect("/login"); // Redirect to login page

  return null; // Prevent rendering anything
}
