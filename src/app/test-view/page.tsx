"use client";

import React, { useEffect, useState } from "react";

// Import your already-developed forms
import {
  Breadcrumb,
  OnlyInstructionForm,
  OnlyQuestionForm,
  OnlyWinnersForm,
  PageLayout,
  StepNavigation,
  TriviaGamePlay,
} from "@/components";
import OnlyContestForm from "@/components/Forms/OnlyContestForm";
import { useContest } from "@/context/ContestContext";
import { ContestServices } from "@/services";
import { useRouter } from "next/navigation";

const steps = [
  "Contest Details",
  "Winners & Rewards",
  "Instructions",
  "Game Questions",
  "Review & Publish",
];

export default function CreateContest() {
  const fd = new FormData();
  const { push } = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData } = useContest();

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  const goNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (e: number) => setCurrentStep((prev) => e);

  const handleContestSave = async () => {
    try {
      const form = buildContestFormData(formData);
      const { data } = await ContestServices.createContest(form);
      if (data && data.data) {
        push("/contests");
      }
    } catch (error: any) {
      console.error("Error saving contest:", error);
    }
  };

  function buildContestFormData(formData: any): FormData {
    fd.append("name", formData.contest_name || "");
    fd.append("rewards", formData.reward_name || "");

    const startDateTime =
      formData.start_date && formData.start_time
        ? new Date(
            `${formData.start_date}T${formData.start_time}:00Z`,
          ).toISOString()
        : "";
    const endDateTime =
      formData.end_date && formData.end_time
        ? new Date(
            `${formData.end_date}T${formData.end_time}:00Z`,
          ).toISOString()
        : "";

    fd.append("startDate", startDateTime);
    fd.append("endDate", endDateTime);
    fd.append("contestType", formData.contest_type || "FREE");
    fd.append(
      "contestFee",
      formData.contest_type === "PAID"
        ? String(formData.contest_fee || 0)
        : "0",
    );
    fd.append("contestTypeName", formData.contest_type_name || "");
    fd.append("sponsored_name", formData.sponsor_name || "");

    // Append files with proper checking
    if (formData.sponsor_logo instanceof File) {
      fd.append(
        "sponsored_logo",
        formData.sponsor_logo,
        formData.sponsor_logo.name,
      );
    }
    if (formData.thumbnail instanceof File) {
      fd.append("thumbnail", formData.thumbnail, formData.thumbnail.name);
    }
    if (formData.contest_image instanceof File) {
      fd.append(
        "contestImage",
        formData.contest_image,
        formData.contest_image.name,
      );
    }
    return fd;
  }

  const questions = [
    {
      question_no: 1,
      question_text: "What is the name of the game?",
      options: [
        { option_text: "Trivia", label: "A" },
        { option_text: "Trivia", label: "B" },
        { option_text: "Trivia", label: "C" },
        { option_text: "Trivia", label: "D" },
      ],
      timer: 10000,
    },
    {
      question_no: 2,
      question_text: "What is the captial of France ?",
      options: [
        { option_text: "Germany", label: "A" },
        { option_text: "Mexico", label: "B" },
        { option_text: "Paris", label: "C" },
        { option_text: "Brazil", label: "D" },
      ],
      timer: 10000,
    },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnlyContestForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleContestSave}
          />
        );
      case 1:
        return (
          <OnlyWinnersForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleContestSave}
          />
        );
      case 2:
        return (
          <OnlyInstructionForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={() => {}}
          />
        );
      case 3:
        return (
          <OnlyQuestionForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={() => {}}
            handleFlipSetModalOpen={() => {}}
          />
        );
      case 4:
        return (
          <TriviaGamePlay questions={questions} addNewQuestion={() => {}} />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto p-6">
        <Breadcrumb
          currentStep={currentStep}
          steps={steps}
          onClick={(e) => goToStep(e)}
        />
        {renderStep()}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={goNext}
          onPrev={goPrev}
        />
      </div>
    </PageLayout>
  );
}
