"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components";
import { QuestionSetServices } from "@/services/trivia/sets.service";
import QuestionSetSection from "@/components/Section/QuestionSetSection";
import QuestionSetModal from "@/components/Modal/QuestionSetModal";
import { useModal } from "@/hooks/useModal";
import { QuestionSet, QuestionSetFormData } from "@/types/questionSet";

type fetchQuestionSetsArgs =
  | { q?: string; page?: number; limit?: number }
  | undefined;

const QuestionSetsPage = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedQuestionSet, setSelectedQuestionSet] =
    useState<QuestionSet | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchString, setSearchString] = useState("");
  const modal = useModal();

  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  const fetchQuestionSets = async (args?: fetchQuestionSetsArgs) => {
    try {
      const { data } = await QuestionSetServices.getAllQuestionSets({
        ...args,
      });
      if (data?.data?.rows) {
        setQuestionSets(data.data.rows);
      }
    } catch (error) {
      console.error("Error fetching question sets:", error);
    }
  };

  useEffect(() => {
    if (!searchString) {
      fetchQuestionSets({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });
      return;
    }
    // Set a timer to delay the API call
    const timerId = setTimeout(() => {
      fetchQuestionSets({
        q: searchString,
      });
    }, 500); // Adjust the delay (in milliseconds) as needed

    // Clear the timer if the user types again before the delay is over
    return () => {
      clearTimeout(timerId);
    };
  }, [searchString, paginationModel]); // Re-run the effect when searchString

  const handleQuestionSetView = (questionSet: QuestionSet) => {
    setIsViewMode(true);
    setSelectedQuestionSet(questionSet);
    setSelectedQuestionSet(questionSet);
    modal.open();
  };
  const handleQuestionSetEdit = (questionSet: QuestionSet) => {
    setIsViewMode(false);
    setSelectedQuestionSet(questionSet);
    setSelectedQuestionSet(questionSet);
    modal.open();
  };

  const handleQuestionSetDelete = async (id: number) => {
    try {
      await QuestionSetServices.deleteQuestionSet(id.toString());
      fetchQuestionSets();
    } catch (err) {
      console.error("Error deleting question set:", err);
      console.error("Error deleting question set:", err);
    }
  };

  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setPaginationModel({
      page,
      pageSize,
    });
    setPaginationModel({
      page,
      pageSize,
    });
  };

  return (
    <>
      <div className="mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Question Sets Management</h1>
        </div>

        <div className="my-4">
          <SearchBar
            value={searchString}
            onChange={(text: string) => setSearchString(text)}
          />
        </div>

        <div className="space-y-6">
          <QuestionSetSection
            questionSets={questionSets}
            onView={handleQuestionSetView}
            onEdit={handleQuestionSetEdit}
            onDelete={handleQuestionSetDelete}
            onSave={async (formData: QuestionSetFormData) => {
              await fetchQuestionSets();
            }}
            rowCount={questionSets.length}
            onPaginationModelChange={handlePaginationModelChange}
          />

          <QuestionSetModal
            isOpen={modal.isOpen}
            onClose={modal.close}
            questionSetData={selectedQuestionSet}
            isViewMode={isViewMode}
            onSave={async () => {
              await fetchQuestionSets();
              modal.close();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default QuestionSetsPage;
