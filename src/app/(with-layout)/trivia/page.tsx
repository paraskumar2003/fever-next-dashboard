"use client";

import React, { useEffect, useState } from "react";

// Import your already-developed forms
import {
  Breadcrumb,
  OnlyInstructionForm,
  OnlyQuestionForm,
  OnlyWinnersForm,
  TriviaGamePlay,
  validateContestFormData,
  validateInstructionFormData,
  validateQuestionFormData,
  validateWinnersForm,
} from "@/components";
import OnlyContestForm from "@/components/Forms/OnlyContestForm";
import { useContest } from "@/context/ContestContext";
import { ContestServices, TriviaServices } from "@/services";
import { QuestionSetServices } from "@/services/trivia/sets.service";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { toast } from "react-toastify";
import {
  buildContestFormData,
  buildInstructionFormData,
  buildQuestionJsonData,
} from "@/lib/utils";
import { Instruction, WinnerReward } from "@/types";
import {
  Question as PreviewQuestion,
  Option as PreviewOption,
} from "@/components/Preview/Trivia/types";

const steps = [
  "Contest Details",
  "Winners & Rewards",
  "Instructions",
  "Game Questions",
  "Preview",
];

export default function CreateContest() {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const contest_id = searchParams.get("contest_id");

  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData, resetFormData } = useContest();
  const [editMode, setEditMode] = useState<{
    winners: boolean;
    instruction: boolean;
    questions: boolean;
  }>({
    winners: false,
    instruction: false,
    questions: false,
  }); // New state for edit mode

  // Add state for preview questions
  const [previewQuestions, setPreviewQuestions] = useState<PreviewQuestion[]>(
    [],
  );

  // Add state for contest form errors
  const [contestFormErrors, setContestFormErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const contest_id = searchParams.get("contest_id");
    if (!contest_id) {
      resetFormData();
    }
  }, [searchParams]);

  // New state to track submission status for each form
  const [formSubmissionStatus, setFormSubmissionStatus] = useState({
    contestDetails: false,
    winnersAndRewards: false,
    instructions: false,
    gameQuestions: false,
  });

  // Fetch questions for preview when category and set are selected
  const fetchPreviewQuestions = async () => {
    if (formData.QuestionCategoryId) {
      try {
        const { data } = await QuestionSetServices.getQuestionSetsByCategoryId(
          formData.QuestionCategoryId,
        );

        if (data?.data?.rows) {
          // Find the specific question set matching formData.set_id
          // const selectedQuestionSet = data.data.rows.find(
          //   (set: any) => set.id === formData.set_id,
          // );

          const selectedQuestionSet = data.data.rows[0];
          console.log({ selectedQuestionSet });

          if (selectedQuestionSet && selectedQuestionSet.questions) {
            // Map API questions to preview format
            const mappedQuestions: PreviewQuestion[] =
              selectedQuestionSet.questions
                .filter((q: any) => q.status === 1) // Only include active questions
                .slice(0, formData.questions?.length || 10) // Limit to selected number of questions
                .map((question: any, index: number) => {
                  // Map question options to preview format
                  const options: PreviewOption[] = question.questionOptions.map(
                    (option: any, optionIndex: number) => ({
                      option_text: option.answer,
                      label: String.fromCharCode(65 + optionIndex), // A, B, C, D
                      id: optionIndex,
                      is_correct: option.is_correct,
                    }),
                  );

                  return {
                    question_no: index + 1,
                    question_text: question.question,
                    options: options,
                    timer:
                      formData.game_time_level === "QUESTION"
                        ? parseInt(formData.questions?.[index]?.timer || "10") *
                          1000
                        : parseInt(formData.game_timer || "60") * 1000,
                  };
                });

            setPreviewQuestions(mappedQuestions);
          }
        }
      } catch (error) {
        console.error("Error fetching preview questions:", error);
        // Fallback to dummy questions if API fails
        setPreviewQuestions([
          {
            question_no: 1,
            question_text: "Sample question - API data not available",
            options: [
              {
                option_text: "Option A",
                label: "A",
                id: 0,
                is_correct: true,
              },
              {
                option_text: "Option B",
                label: "B",
                id: 1,
                is_correct: false,
              },
              {
                option_text: "Option C",
                label: "C",
                id: 2,
                is_correct: false,
              },
              {
                option_text: "Option D",
                label: "D",
                id: 3,
                is_correct: false,
              },
            ],
            timer: 10000,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    fetchPreviewQuestions();
  }, [
    formData.QuestionCategoryId,
    formData.set_id,
    formData.questions?.length,
    formData.game_time_level,
    formData.game_timer,
  ]);

  const fetchContestDetails = async (contest_id: string) => {
    try {
      const { data } = await ContestServices.getContestById(contest_id);
      if (data?.data) {
        const details = data.data;
        if (details.contestPrizes?.length > 0) {
          setEditMode((prev) => ({ ...prev, winners: true }));
          setFormSubmissionStatus((prev) => ({
            ...prev,
            winnersAndRewards: true,
          }));
        }
        if (details.instructions?.length > 0) {
          setEditMode((prev) => ({ ...prev, instructions: true }));
          setFormSubmissionStatus((prev) => ({
            ...prev,
            instructions: true,
          }));
        }
        if (details.questionSet?.noOfQuestions > 0) {
          setEditMode((prev) => ({ ...prev, gameQuestions: true }));
          setFormSubmissionStatus((prev) => ({
            ...prev,
            gameQuestions: true,
          }));
        }
        updateFormData({
          ...formData,
          contest_id: details.id,
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
          isPopular: details.isPopular,
          contest_hero_logo_preview: details?.contestHeroLogo,
          winners: details?.contestPrizes?.map((e: any) => ({
            reward_id: e?.reward?.id,
            bucks: e.fever_bucks,
            qty: e.quantity,
            reward_type: e.reward?.reward_type,
          })),
          instructions:
            details?.instructions.length > 0
              ? details?.instructions.map((instruction: Instruction) => ({
                  title: instruction.title,
                  description: instruction.description,
                }))
              : [
                  {
                    title: "",
                    description:
                      "Get a Tambola ticket and wait for contestto begin",
                  },
                  {
                    title: "",
                    description:
                      "Ensure that you mark the numbers onyour ticket that have been called out",
                  },
                  {
                    title: "",
                    description:
                      "The number will be marked in RED incase automatically in case you missedto mark",
                  },
                  {
                    title: "",
                    description:
                      "Categories to win:- Full House, Lines, Corners, and early 5",
                  },
                ],
          mega_prize_name: details?.rewards?.reward,
          flip_allowed: details?.questionSet.flipAllowed,
          flip_fee: details?.questionSet.flipFee,
          flipSet: details?.questionSet?.flipCategory?.id,
          QuestionCategoryId: details?.questionSet.questionCategory?.id,
          game_time_level:
            details?.questionSet.timerType == "QUESTIONS" ? "QUESTION" : "GAME",
          questions: new Array(details?.questionSet?.noOfQuestions || 1)
            .fill({
              question: "",
              option1: "",
              option2: "",
              option3: "",
              option4: "",
              correctOption: "",
              timer: "10",
            })
            .map((e, i) => ({
              ...e,
              timer: details?.questionSet?.timerValues[i] || e?.timer || "10",
            })),
          game_timer:
            details?.questionSet?.timerType === "GAME"
              ? details?.questionSet?.timerValues[0]
              : "0",
          fever_logo: !details?.isSponsored,
        });
        // If contest details are fetched, assume this step is "submitted"
        setFormSubmissionStatus((prev) => ({ ...prev, contestDetails: true }));
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

  useEffect(() => {
    console.log({ formSubmissionStatus });
  }, [formSubmissionStatus]);

  const goNext = (force = false) => {
    if (!force) {
      if (currentStep === 0 && !formSubmissionStatus.contestDetails) {
        toast.warning("Please save Contest Details before proceeding.");
        return;
      }
      if (
        currentStep === 1 &&
        !formSubmissionStatus.winnersAndRewards &&
        !editMode.winners
      ) {
        toast.warning("Please save Winners & Rewards before proceeding.");
        return;
      }
      if (
        currentStep === 2 &&
        !formSubmissionStatus.instructions &&
        !editMode.instruction
      ) {
        toast.warning("Please save Instructions before proceeding.");
        return;
      }
      if (
        currentStep === 3 &&
        !formSubmissionStatus.gameQuestions &&
        !editMode.questions
      ) {
        toast.warning("Please save Game Questions before proceeding.");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToStep = (e: number) => {
    // Prevent jumping to steps if previous forms are not submitted
    if (e > 0 && !formSubmissionStatus.contestDetails) {
      toast.warning(
        "Please save Contest Details before navigating to other steps.",
      );
      return;
    }
    if (e > 1 && !formSubmissionStatus.winnersAndRewards) {
      toast.warning(
        "Please save Winners & Rewards before navigating to other steps.",
      );
      return;
    }
    if (e > 2 && !formSubmissionStatus.instructions) {
      toast.warning(
        "Please save Instructions before navigating to other steps.",
      );
      return;
    }
    if (e > 3 && !formSubmissionStatus.gameQuestions) {
      toast.warning(
        "Please save Game Questions before navigating to other steps.",
      );
      return;
    }
    setCurrentStep(e);
  };

  const checkInstructionForm = async () => {
    let { isValid, errors: e } = await validateInstructionFormData(formData);
    setContestFormErrors((prev) => e);
    return { isValid, errors: e };
  };

  const checkWinnersForm = async () => {
    let { isValid, errors: e } = await validateWinnersForm(formData);
    console.log({ e });
    setContestFormErrors((prev) => e);
    return { isValid, errors: e };
  };

  const checkQuestionsForm = async () => {
    let { isValid, errors } = await validateQuestionFormData(formData);
    if (currentStep == 2) setContestFormErrors(errors);
    return { isValid, errors };
  };

  const checkContestForm = async () => {
    let { isValid, errors } = await validateContestFormData(formData);
    setContestFormErrors(errors);
    return { isValid, errors };
  };

  const handleContestSave = async () => {
    try {
      // Validate form data
      let { isValid } = await checkContestForm();

      if (!isValid) {
        toast.warning("Please fix the validation errors before proceeding.");
        return false;
      }

      // Clear any existing errors if validation passes

      const form = buildContestFormData(formData, contest_id);
      const { data } = await ContestServices.createContest(form);
      // Assuming the new contest_id is returned and should be set
      if (data?.data?.id) {
        updateFormData({ contest_id: data.data.id });
        toast.success("Contest Details saved successfully!");
        setFormSubmissionStatus((prev) => ({ ...prev, contestDetails: true }));
        push(`/trivia?contest_id=${data?.data.id}`);
        return true; // Indicate success
      }
      return false;
    } catch (error: any) {
      toast.error("Failed to save Contest Details.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    }
  };

  const handleInstructionSave = async () => {
    try {
      let { isValid } = await checkInstructionForm();

      if (!isValid) {
        toast.warning("Please fix the validation errors before proceeding.");
        return false;
      }

      const form = buildInstructionFormData(formData, contest_id);
      let { data } = await TriviaServices.createInstruction(form);
      if (data) {
        setFormSubmissionStatus((prev) => ({ ...prev, instructions: true }));
        toast.success("Instructions saved successfully!");
        return true; // Indicate success
      }
      return false; // Indicate failure
    } catch (error: any) {
      toast.error("Failed to save Instructions.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    }
  };

  const handleGameQuestionSave = async () => {
    try {
      let { isValid, errors } = await checkQuestionsForm();

      if (!isValid) {
        toast.warning("Please fix the validation errors before proceeding.");
        return false;
      }

      const form = buildQuestionJsonData(formData, contest_id);
      let { data } = await TriviaServices.postGameQuestionForm(form);
      if (data) {
        setFormSubmissionStatus((prev) => ({ ...prev, gameQuestions: true }));
        toast.success("Game Questions saved successfully!");
        fetchPreviewQuestions();
        return true; // Indicate success
      }
      return false; // Indicate failure
    } catch (error: any) {
      toast.error("Failed to save Game Questions.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    }
  };

  const handleWinnersSave = async () => {
    try {
      console.log("trying to save winners");

      if (!formData.contest_id || !formData.winners?.length) {
        toast.error("At least one winner is required");
        return false;
      }

      let { isValid } = await checkWinnersForm();
      if (!isValid) {
        toast.warning("Please fix the validation errors before proceeding.");
        return false;
      }

      const payload = {
        contest_id: Number(formData.contest_id),
        prizes: formData.winners.map((winner) => ({
          reward_id: Number(winner.reward_id),
          bucks: Number(winner.bucks) || 0,
          qty: Number(winner.qty) || 0,
        })),
      };

      await ContestServices.createContestPrize(payload);
      setFormSubmissionStatus((prev) => ({ ...prev, winnersAndRewards: true }));
      toast.success("Contest prizes saved successfully!");
      return true; // Indicate success
    } catch (error) {
      console.error("Error saving contest prizes:", error);
      toast.error("Failed to save contest prizes");
      return false; // Indicate failure
    }
  };

  const handleChangeIndex = async (e: number) => {
    let saved = false;
    switch (e) {
      case 0:
        saved = await handleContestSave();
        break;
      case 1:
        saved = await handleWinnersSave();
        break;
      case 2:
        saved = await handleInstructionSave();
        break;
      case 3:
        saved = await handleGameQuestionSave();
        break;
      case 4:
        saved = true;
      default:
        break;
    }
    if (saved) {
      goNext(true);
    }
  };

  const handlePublish = () => {
    const publishContest = async () => {
      try {
        if (!formData.contest_id) {
          toast.error("Contest ID is required to publish");
          return;
        }

        const response = await ContestServices.updateContestStatus(
          formData.contest_id.toString(),
          1, // Status 1 for active/published
        );

        if (response.data) {
          toast.success("Game Published Successfully!");
          push("/view/trivia?category=upcoming");
        } else {
          toast.error(
            response.response?.message || "Failed to publish contest",
          );
        }
      } catch (error) {
        console.error("Error publishing contest:", error);
        toast.error("An error occurred while publishing the contest");
      }
    };

    publishContest();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnlyContestForm
            formData={formData}
            updateFormData={updateFormData}
            errors={contestFormErrors}
            onSave={() => {
              handleChangeIndex(currentStep);
            }}
          />
        );
      case 1:
        return (
          <OnlyWinnersForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={() => {
              handleChangeIndex(currentStep);
            }}
            errors={contestFormErrors}
          />
        );
      case 2:
        return (
          <OnlyInstructionForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={() => {
              handleChangeIndex(currentStep);
            }}
            errors={contestFormErrors}
          />
        );
      case 3:
        return (
          <OnlyQuestionForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={() => {
              handleChangeIndex(currentStep); // Call handleChangeIndex for consistency
            }}
            handleFlipSetModalOpen={() => {}}
            errors={contestFormErrors}
          />
        );
      case 4:
        return (
          <TriviaGamePlay
            questions={previewQuestions}
            formData={formData}
            addNewQuestion={() => {}}
            onPublish={handlePublish}
          />
        );
      default:
        return null;
    }
  };

  /** realtime validations */
  useEffect(() => {
    if (currentStep !== undefined && currentStep !== null) {
      switch (currentStep) {
        case 0:
          if (contest_id) checkContestForm();
          break;
        case 1:
          if (contest_id && formData.winners) checkWinnersForm();
          break;
        case 2:
          if (contest_id && formData.instructions) checkInstructionForm();
          break;
        case 4:
          if (contest_id && formData.questions) checkQuestionsForm();
          break;
      }
    }
  }, [formData]);

  useEffect(() => {
    console.log({ contestFormErrors });
  }, [contestFormErrors]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Trivia Contest
        </h1>
        <p className="mt-2 text-gray-600">
          Follow the steps below to create your trivia contest.
        </p>
      </div>
      <Breadcrumb
        currentStep={currentStep}
        steps={steps}
        onClick={(e) => goToStep(e)}
      />
      {renderStep()}{" "}
    </div>
  );
}
