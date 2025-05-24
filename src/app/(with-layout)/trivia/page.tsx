"use client";

import React, { useEffect, useState } from "react";

// Import your already-developed forms
import {
  Breadcrumb,
  OnlyInstructionForm,
  OnlyQuestionForm,
  OnlyWinnersForm,
  StepNavigation,
  TriviaGamePlay,
} from "@/components";
import OnlyContestForm from "@/components/Forms/OnlyContestForm";
import { useContest } from "@/context/ContestContext";
import { ContestServices, TriviaServices } from "@/services";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Notiflix from "notiflix";
import {
  buildContestFormData,
  buildInstructionFormData,
  buildQuestionFormData,
  buildQuestionJsonData,
} from "@/lib/utils";

const steps = [
  "Contest Details",
  "Winners & Rewards",
  "Instructions",
  "Game Questions",
  "Review & Publish",
];

export default function CreateContest() {
  const searchParams = useSearchParams();

  const contest_id = searchParams.get("contest_id");

  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData } = useContest();

  const fetchContestDetails = async (contest_id: string) => {
    try {
      const { data } = await ContestServices.getContestById(contest_id);
      if (data?.data) {
        const details = data.data;
        updateFormData({
          ...formData,
          contest_name: details.name,
          reward_name: details?.rewards?.prize,
          start_date: moment(details?.startDate).format("YYYY-MM-DD"),
          end_date: moment(details?.endDate).format("YYYY-MM-DD"),
          start_time: moment(details?.startDate).format("HH:mm"),
          end_time: moment(details?.endDate).format("HH:mm"),
          contest_type: details?.contestType as "FREE" | "PAID",
          contest_fee: details?.contestFee,
          contest_type_name: details?.contestTypeName,
          contest_variant_name: details?.contestVariantName,
          sponsor_name: details?.sponsored_name,
          sponsor_logo_preview: details?.sponsored_logo,
          thumbnail_preview: details?.thumbnail,
          contest_image_preview: details?.contestImage,
          contest_hero_logo_preview: details?.contestHeroLogo,
        });
      }
    } catch (error) {
      console.error("Error fetching contest details:", error);
    }
  };

  useEffect(() => {
    if (contest_id) {
      fetchContestDetails(contest_id);
    }
  }, [contest_id]);

  const goNext = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const goToStep = (e: number) => setCurrentStep((prev) => e);

  const handleContestSave = async () => {
    Notiflix.Loading.circle();
    try {
      const form = buildContestFormData(formData, contest_id);
      if (!contest_id) {
        await ContestServices.createContest(form);
      }
      goNext();
      Notiflix.Loading.remove();
    } catch (error: any) {
      Notiflix.Loading.remove();
      console.error("Error saving contest:", error);
    }
  };

  const handleInstructionSave = async () => {
    Notiflix.Loading.circle();
    try {
      const form = buildInstructionFormData(formData, contest_id);
      let res = await TriviaServices.createInstruction(form);
      if (res) goNext();
      Notiflix.Loading.remove();
    } catch (error: any) {
      Notiflix.Loading.remove();
      console.error("Error saving contest:", error);
    }
  };

  const handleGameQuestionSave = async () => {
    Notiflix.Loading.circle();
    try {
      const form = buildQuestionJsonData(formData, contest_id);
      let res = await TriviaServices.postGameQuestionForm(form);
      if (res) goNext();
      Notiflix.Loading.remove();
    } catch (error: any) {
      Notiflix.Loading.remove();
      console.error("Error saving contest:", error);
    }
  };

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
            onSave={handleInstructionSave}
          />
        );
      case 3:
        return (
          <OnlyQuestionForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleGameQuestionSave}
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
  );
}

// ContestId;
// QuestionCategoryId;
// NoOfQuestions;
// Timing;
// QuestionFlip;
