"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useContest } from "@/context/ContestContext";
import { SearchBar } from "@/components";
import { ContestServices, TriviaServices } from "@/services";
import moment from "moment";
import QuestionModal from "@/components/Modal/QuestionModal";
import { useModal } from "@/hooks/useModal";
import QuestionSection from "@/components/Section/QuestionSection";

const TriviaPage = () => {
  const router = useSearchParams();
  const contest_id = router.get("contest_id");

  const { formData, updateFormData } = useContest();
  const [questions, setQuestions] = useState([]);
  const [contestQuestionIds, setContestQuestionIds] = useState<number[]>([]);

  /* -- States for Instructions -- */
  const [instructions, setInstructions] = useState([]);
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const instructionModal = useModal();

  const fd = new FormData();
  const modal = useModal();

  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);

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

  const fetchContestQuestions = async (contest_id: string): Promise<any> => {
    try {
      const { data } = await TriviaServices.getQuestionsByContestId(contest_id);
      if (data?.data?.contest?.questions) {
        const questionIds = data.data.contest.questions.map((q: any) => q.id);
        setContestQuestionIds((prevIds) => questionIds);
      }
      return true;
    } catch (err) {
      console.error("Error fetching contest questions:", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      if (contestQuestionIds) {
        const { data } = await TriviaServices.getAllQuestions();
        if (data?.data?.questions) {
          setQuestions(
            data.data.questions.map((q: any) => ({
              ...q,
              status: contestQuestionIds.includes(q.id) ? 1 : 0,
            })),
          );

          const questions = data.data.questions.map((q: any) => ({
            question: q.question,
            option1: q.answers[0].answer,
            option2: q.answers[1].answer,
            option3: q.answers[2].answer,
            option4: q.answers[3].answer,
            correctOption: `option${q.answers.findIndex((a: any) => a.is_correct) + 1}`,
            timer: q.timer,
            status: contestQuestionIds.includes(q.id) ? 1 : 0,
          }));
          updateFormData({ questions });
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (contest_id) {
      fetchContestDetails(contest_id as string);
      fetchContestQuestions(contest_id as string);
      fetchInstructions(contest_id as string);
    }
  }, [contest_id]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestionDetails = async (id: number) => {
    try {
      const { data } = await TriviaServices.getQuestionById(id.toString());
      if (data?.data) {
        const question = data.data;
        const formattedQuestion = {
          id: question.id,
          question: question.question,
          option1: question.answers[0].answer,
          option2: question.answers[1].answer,
          option3: question.answers[2].answer,
          option4: question.answers[3].answer,
          correctOption: `option${question.answers.findIndex((a: any) => a.is_correct) + 1}`,
          timer: question.timer || 10000,
          status: question.status,
        };
        setSelectedQuestion(formattedQuestion);
      }
    } catch (err) {
      console.error("Error fetching question details:", err);
    } finally {
    }
  };

  const handleQuestionView = async (question: any) => {
    setIsViewMode(true);
    await fetchQuestionDetails(question.id);
    modal.open();
  };

  const handleQuestionEdit = async (question: any) => {
    setIsViewMode(false);
    await fetchQuestionDetails(question.id);
    modal.open();
  };

  const handleQuestionDelete = async (id: number) => {
    try {
      await TriviaServices.deleteQuestion(id.toString());
      if (contest_id) {
        fetchQuestions();
      }
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleStatusChange = async (id: number, statusToChanged: number) => {
    try {
      // Update the contestQuestionIds based on the status
      if (contestQuestionIds) {
        setContestQuestionIds((prevIds) => {
          if (statusToChanged === 0) {
            // Remove the id if status is 0
            if (prevIds)
              return prevIds.filter((questionId) => questionId !== id);
          } else if (statusToChanged === 1) {
            // Add the id if status is 1 and it's not already present
            if (prevIds)
              return prevIds.includes(id) ? prevIds : [...prevIds, id];
          }
          return prevIds; // Default case (no change)
        });
      }

      if (contest_id) {
        await TriviaServices.updateContestQuestions(
          contestQuestionIds || [],
          Number(contest_id),
        );
        await fetchContestQuestions(contest_id);
      }
    } catch (err) {
      console.error("Error updating question status:", err);
    }
  };

  const fetchInstructions = async (contest_id: string) => {
    try {
      const { data } =
        await TriviaServices.getInstructionByContestId(contest_id);
      if (data?.data) {
        setInstructions(data.data);
      }
    } catch (err) {
      console.error("Error fetching instructions:", err);
    } finally {
    }
  };

  // Instruction handlers
  const handleInstructionView = (instruction: any) => {
    setIsViewMode(true);
    setSelectedInstruction(instruction);
    instructionModal.open();
  };

  const handleInstructionEdit = (instruction: any) => {
    setIsViewMode(false);
    setSelectedInstruction(instruction);
    instructionModal.open();
  };

  const handleInstructionDelete = async (id: string) => {
    try {
      // Add your delete instruction API call here
      if (contest_id) {
        fetchInstructions(contest_id);
      }
    } catch (err) {
      console.error("Error deleting instruction:", err);
    }
  };

  return (
    <>
      <SearchBar value="" onChange={() => {}} />

      <div className="mx-auto  py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questionaire (Trivia)</h1>
        </div>

        <div className="space-y-6">
          {/* <OnlyContestForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleContestSave}
          /> */}
          <QuestionSection
            questions={questions}
            onView={handleQuestionView}
            onEdit={handleQuestionEdit}
            onDelete={handleQuestionDelete}
            onStatusChange={handleStatusChange}
            onSave={async () => {
              if (contest_id) {
                await fetchQuestions();
              }
            }}
          />
          <QuestionModal
            isOpen={modal.isOpen}
            onClose={modal.close}
            questionData={selectedQuestion}
            isViewMode={isViewMode}
            onSave={async () => {
              if (contest_id) {
                await fetchQuestions();
              }
              modal.close();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TriviaPage;
