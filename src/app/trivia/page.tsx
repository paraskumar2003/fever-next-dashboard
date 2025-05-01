"use client";
import React, { Suspense } from "react";
import TriviaPageComponent from "./TriviaPage";

export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading trivia...</div>}>
      <TriviaPageComponent />
    </Suspense>
  );
}
