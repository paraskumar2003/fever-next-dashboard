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
import Notiflix from "notiflix";
import {
  buildContestFormData,
  buildInstructionFormData,
  buildQuestionJsonData,
} from "@/lib/utils";
import { Instruction, WinnerReward } from "@/types";
import { Question as PreviewQuestion, Option as PreviewOption } from "@/components/Preview/Trivia/types";

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
  const [previewQuestions, setPreviewQuestions] = useState<PreviewQuestion[]>([]);

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

  useEffect(() => {
    console.log(editMode);
  }, [editMode]);

  // New state to track submission status for each form
  const [formSubmissionStatus, setFormSubmissionStatus] = useState({
    contestDetails: false,
    winnersAndRewards: false,
    instructions: false,
    gameQuestions: false,
  });

  // Fetch questions for preview when category and set are selected
  useEffect(() => {
    const fetchPreviewQuestions = async () => {
      if (formData.QuestionCategoryId && formData.set_id) {
        try {
          const { data } = await QuestionSetServices.getQuestionSetsByCategoryId(
            formData.QuestionCategoryId
          );
          
          if (data?.data?.rows) {
            // Find the specific question set matching formData.set_id
            const selectedQuestionSet = data.data.rows.find(
              (set: any) => set.id === formData.set_id
            );
            
            if (selectedQuestionSet && selectedQuestionSet.questions) {
              // Map API questions to preview format
              const mappedQuestions: PreviewQuestion[] = selectedQuestionSet.questions
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
                    })
                  );

                  return {
                    question_no: index + 1,
                    question_text: question.question,
                    options: options,
                    timer: formData.game_time_level === "QUESTION" 
                      ? parseInt(formData.questions?.[index]?.timer || "10") * 1000
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
                { option_text: "Option A", label: "A", id: 0, is_correct: true },
                { option_text: "Option B", label: "B", id: 1, is_correct: false },
                { option_text: "Option C", label: "C", id: 2, is_correct: false },
                { option_text: "Option D", label: "D", id: 3, is_correct: false },
              ],
              timer: 10000,
            },
          ]);
        }
      }
    };

    fetchPreviewQuestions();
  }, [formData.QuestionCategoryId, formData.set_id, formData.questions?.length, formData.game_time_level, formData.game_timer]);

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
        Notiflix.Notify.warning(
          "Please save Contest Details before proceeding.",
        );
        return;
      }
      if (
        currentStep === 1 &&
        !formSubmissionStatus.winnersAndRewards &&
        !editMode.winners
      ) {
        Notiflix.Notify.warning(
          "Please save Winners & Rewards before proceeding.",
        );
        return;
      }
      if (
        currentStep === 2 &&
        !formSubmissionStatus.instructions &&
        !editMode.instruction
      ) {
        Notiflix.Notify.warning("Please save Instructions before proceeding.");
        return;
      }
      if (
        currentStep === 3 &&
        !formSubmissionStatus.gameQuestions &&
        !editMode.questions
      ) {
        Notiflix.Notify.warning(
          "Please save Game Questions before proceeding.",
        );
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToStep = (e: number) => {
    // Prevent jumping to steps if previous forms are not submitted
    if (e > 0 && !formSubmissionStatus.contestDetails) {
      Notiflix.Notify.warning(
        "Please save Contest Details before navigating to other steps.",
      );
      return;
    }
    if (e > 1 && !formSubmissionStatus.winnersAndRewards) {
      Notiflix.Notify.warning(
        "Please save Winners & Rewards before navigating to other steps.",
      );
      return;
    }
    if (e > 2 && !formSubmissionStatus.instructions) {
      Notiflix.Notify.warning(
        "Please save Instructions before navigating to other steps.",
      );
      return;
    }
    if (e > 3 && !formSubmissionStatus.gameQuestions) {
      Notiflix.Notify.warning(
        "Please save Game Questions before navigating to other steps.",
      );
      return;
    }
    setCurrentStep(e);
  };

  const handleContestSave = async () => {
    Notiflix.Loading.circle();
    try {
      // Validate form data
      let { isValid, errors } = await validateContestFormData(formData);
      console.log({ errors });

      if (!isValid) {
        // Set errors in state for display
        setContestFormErrors(errors);
        Notiflix.Notify.warning(
          "Please fix the validation errors before proceeding.",
        );
        return false;
      }

      // Clear any existing errors if validation passes
      setContestFormErrors({});

      const form = buildContestFormData(formData, contest_id);
      const { data } = await ContestServices.createContest(form);
      // Assuming the new contest_id is returned and should be set
      push(`/trivia?contest_id=${data?.data.id}`);
      if (data?.data?.id) {
        updateFormData({ contest_id: data.data.id });
      }
      setFormSubmissionStatus((prev) => ({ ...prev, contestDetails: true }));
      Notiflix.Notify.success("Contest Details saved successfully!");
      return true; // Indicate success
    } catch (error: any) {
      Notiflix.Notify.failure("Failed to save Contest Details.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleInstructionSave = async () => {
    Notiflix.Loading.circle();
    try {
      let { isValid, errors } = await validateInstructionFormData(formData);

      console.log({ errors });

      if (!isValid) {
        // Set errors in state for display
        setContestFormErrors(errors);
        Notiflix.Notify.warning(
          "Please fix the validation errors before proceeding.",
        );
        return false;
      }

      setContestFormErrors({});
      const form = buildInstructionFormData(formData, contest_id);
      let { data } = await TriviaServices.createInstruction(form);
      if (data) {
        setFormSubmissionStatus((prev) => ({ ...prev, instructions: true }));
        Notiflix.Notify.success("Instructions saved successfully!");
        return true; // Indicate success
      }
      return false; // Indicate failure
    } catch (error: any) {
      Notiflix.Notify.failure("Failed to save Instructions.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleGameQuestionSave = async () => {
    Notiflix.Loading.circle();
    try {
      let { isValid, errors } = await validateQuestionFormData(formData);

      if (!isValid) {
        // Set errors in state for display
        setContestFormErrors(errors);
        Notiflix.Notify.warning(
          "Please fix the validation errors before proceeding.",
        );
        return false;
      }

      setContestFormErrors({});
      const form = buildQuestionJsonData(formData, contest_id);
      let res = await TriviaServices.postGameQuestionForm(form);
      if (res) {
        setFormSubmissionStatus((prev) => ({ ...prev, gameQuestions: true }));
        Notiflix.Notify.success("Game Questions saved successfully!");
        return true; // Indicate success
      }
      return false; // Indicate failure
    } catch (error: any) {
      Notiflix.Notify.failure("Failed to save Game Questions.");
      console.error("Error saving contest:", error);
      return false; // Indicate failure
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleWinnersSave = async () => {
    Notiflix.Loading.circle();
    try {
      if (!formData.contest_id || !formData.winners?.length) {
        Notiflix.Notify.failure("Atleast one winner is required");
        return false;
      }

      let { isValid, errors } = await validateWinnersForm(formData);

      console.log(errors);

      if (!isValid) {
        setContestFormErrors(errors);
        Notiflix.Notify.warning(
          "Please fix the validation errors before proceeding.",
        );
        return false;
      }

      const payload = {
        contest_id: Number(formData.contest_id),
        prizes: formData.winners.map((winner) => ({
          reward_id: Number(winner.reward_id),
          bucks: Number(winner.bucks) || 0,
        })),
      };

      await ContestServices.createContestPrize(payload);
      setFormSubmissionStatus((prev) => ({ ...prev, winnersAndRewards: true }));
      Notiflix.Notify.success("Contest prizes saved successfully!");
      return true; // Indicate success
    } catch (error) {
      console.error("Error saving contest prizes:", error);
      Notiflix.Notify.failure("Failed to save contest prizes");
      return false; // Indicate failure
    } finally {
      Notiflix.Loading.remove();
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
    Notiflix.Notify.success("Game Published Successfully!");
    push("/view/trivia?category=upcoming");
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

  return (
    <div className="mx-auto p-6">
      <Breadcrumb
        currentStep={currentStep}
        steps={steps}
        onClick={(e) => goToStep(e)}
      />
      {renderStep()}{" "}
    </div>
  );
}