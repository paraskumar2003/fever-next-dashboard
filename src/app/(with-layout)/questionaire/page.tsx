"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useContest } from "@/context/ContestContext";
import { TriviaServices } from "@/services";
import QuestionModal from "@/components/Modal/QuestionModal";
import { useModal } from "@/hooks/useModal";
import QuestionSection from "@/components/Section/QuestionSection";
import { Question } from "@/types/question";
import { BulkUploadQuestions } from "@/components/BulkUpload";

type fetchQuestionAgrs =
  | { q?: string; page?: number; limit?: number }
  | undefined;

const TriviaPage = () => {
  const router = useSearchParams();
  const contest_id = router.get("contest_id");

  const { updateFormData } = useContest();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    limit: 10,
  });
  const [contestQuestionIds, setContestQuestionIds] = useState<number[]>([]);

  const [searchString, setSearchString] = useState<string>("");

  const modal = useModal();

  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);

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

  const fetchQuestions = async (args?: fetchQuestionAgrs) => {
    try {
      if (contestQuestionIds) {
        const { data } = await TriviaServices.getAllQuestions({
          ...args,
        });
        if (data?.data?.rows) {
          // Map the new API structure to include computed properties
          const mappedQuestions = data.data.rows.map((q: Question) => ({
            ...q,
            status: contestQuestionIds.includes(parseInt(q.id)) ? 1 : 0,
            categoryName: q.category?.name,
            categoryId: q.category?.id,
            setName: q.set?.name,
          }));

          setQuestions(mappedQuestions);
          setRowCount(data.data.meta.total);

          // Update context with formatted questions for backward compatibility
          const contextQuestions = mappedQuestions.map((q: Question) => ({
            question: q.question,
            option1: q.questionOptions[0]?.answer || "",
            option2: q.questionOptions[1]?.answer || "",
            option3: q.questionOptions[2]?.answer || "",
            option4: q.questionOptions[3]?.answer || "",
            correctOption: `option${q.questionOptions.findIndex((a: any) => a.is_correct) + 1}`,
            timer: "10000", // Default timer
            status: contestQuestionIds.includes(parseInt(q.id)) ? 1 : 0,
          }));
          updateFormData({ questions: contextQuestions });
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (searchString) {
      const timerId = setTimeout(() => {
        fetchQuestions({
          q: searchString,
          ...paginationModel,
        });
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      fetchQuestions(paginationModel);
    }
  }, [searchString, paginationModel]);

  const fetchQuestionDetails = async (id: number) => {
    try {
      const { data } = await TriviaServices.getQuestionById(id.toString());
      if (data?.data) {
        const question = data.data;
        const formattedQuestion = {
          id: question.id,
          question: question.question,
          option1: question.questionOptions[0]?.answer || "",
          option2: question.questionOptions[1]?.answer || "",
          option3: question.questionOptions[2]?.answer || "",
          option4: question.questionOptions[3]?.answer || "",
          correctOption: `option${question.questionOptions.findIndex((a: any) => a.is_correct) + 1}`,
          timer: 10000, // Default timer
          status: question.status,
          categoryId: question?.category?.id,
          set_id: question?.set?.id,
        };
        setSelectedQuestion(formattedQuestion);
      }
    } catch (err) {
      console.error("Error fetching question details:", err);
    } finally {
    }
  };

  const handleQuestionView = async (question: Question) => {
    setIsViewMode(true);
    await fetchQuestionDetails(parseInt(question.id));
    modal.open();
  };

  const handleQuestionEdit = async (question: Question) => {
    setIsViewMode(false);
    console.log({ question });
    await fetchQuestionDetails(parseInt(question.id));
    modal.open();
  };

  const handleQuestionDelete = async (id: number) => {
    try {
      await TriviaServices.deleteQuestion(id.toString());
      fetchQuestions();
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

  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setPaginationModel({ ...paginationModel, page, limit: pageSize });
  };

  const handleUploadSuccess = () => {
    fetchQuestions();
  };

  return (
    <>
      <div className="mx-auto  py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questionaire (Trivia)</h1>
        </div>

        <BulkUploadQuestions
          searchString={searchString}
          onSearchChange={(text: string) => setSearchString(text)}
          onUploadSuccess={handleUploadSuccess}
        />

        <div className="space-y-6">
          <QuestionSection
            questions={questions}
            onView={handleQuestionView}
            onEdit={handleQuestionEdit}
            onDelete={handleQuestionDelete}
            onStatusChange={handleStatusChange}
            onPagninationModelChange={handlePaginationModelChange}
            rowCount={rowCount}
            onSave={async () => {
              await fetchQuestions();
            }}
          />
          <QuestionModal
            isOpen={modal.isOpen}
            onClose={modal.close}
            questionData={selectedQuestion}
            isViewMode={isViewMode}
            onSave={async () => {
              await fetchQuestions();
              modal.close();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TriviaPage;