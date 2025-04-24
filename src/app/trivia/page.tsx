"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Save } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import Button from "@/components/Button";
import { PageLayout } from "@/components";
import { ContestServices, TriviaServices } from "@/services";
import moment from "moment";
import { Helpers } from "@/general";
import OnlyQuestionForm from "@/components/Forms/OnlyQuestion";
import OnlyInstructionForm from "@/components/Forms/OnlyInstructionForm";
import OnlyContestForm from "@/components/Forms/OnlyContestForm";

const TriviaPage = () => {
  const { push } = useRouter();
  const router = useSearchParams();
  const { formData, updateFormData } = useContest();
  const contest_id = router.get("contest_id");

  const fd = new FormData();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handleContestSave();
  // };

  const handlePreview = () => {
    push("/preview");
  };

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
          sponsor_logo: details?.sponsored_logo,
          thumbnail: details?.thumbnail,
          contest_image: details?.contestImage,
          contest_hero_logo: details?.contestHeroLogo,
        });
      }
    } catch (error) {
      console.error("Error fetching contest details:", error);
    }
  };

  const fetchQuestions = async (contest_id: string) => {
    try {
      const { data } = await TriviaServices.getQuestionsByContestId(contest_id);
      console.log({ data });
      if (data?.data?.contest?.questions) {
        const questions = data.data.contest.questions.map((q: any) => ({
          question: q.question,
          option1: q.answers[0].answer,
          option2: q.answers[1].answer,
          option3: q.answers[2].answer,
          option4: q.answers[3].answer,
          correctOption: `option${q.answers.findIndex((a: any) => a.is_correct) + 1}`,
          timer: q.timer,
          status: q.status,
        }));
        updateFormData({ questions });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (contest_id) {
      fetchContestDetails(contest_id as string);
      fetchQuestions(contest_id as string);
    }
  }, [contest_id]);

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
    console.log({ fd, formData });
    return fd;
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create Contest (Trivia)</h1>
        </div>

        <div className="space-y-6">
          <OnlyContestForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleContestSave}
          />
          <OnlyQuestionForm />
          <OnlyInstructionForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default TriviaPage;
