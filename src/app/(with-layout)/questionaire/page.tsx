"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useContest } from "@/context/ContestContext";
import { SearchBar } from "@/components";
import { TriviaServices } from "@/services";
import QuestionModal from "@/components/Modal/QuestionModal";
import { useModal } from "@/hooks/useModal";
import QuestionSection from "@/components/Section/QuestionSection";
import { Question } from "@/types/question";
import { Upload } from "lucide-react";
import Button from "@/components/Button";
import { Modal } from "@mui/material";
import FormInput from "@/components/FormInput";
import Notiflix from "notiflix";

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

  // Bulk upload states
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Bulk upload handlers
  const handleBulkUploadClick = () => {
    setShowBulkUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        Notiflix.Notify.failure("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }
      setSelectedExcelFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedExcelFile) {
      Notiflix.Notify.failure("Please select an Excel file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('excel', selectedExcelFile);

      const response = await TriviaServices.bulkUploadQuestions(formData);
      
      if (response.data) {
        Notiflix.Notify.success("Questions uploaded successfully!");
        setShowBulkUploadModal(false);
        setSelectedExcelFile(null);
        // Refresh the questions list
        fetchQuestions();
      } else {
        Notiflix.Notify.failure(response.response?.message || "Failed to upload questions");
      }
    } catch (error) {
      console.error("Error uploading questions:", error);
      Notiflix.Notify.failure("An error occurred while uploading questions");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setSelectedExcelFile(null);
  };

  return (
    <>
      <div className="mx-auto  py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questionaire (Trivia)</h1>
        </div>

        <div className="my-4 flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchString}
              onChange={(text: string) => setSearchString(text)}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBulkUploadClick}
            title="Bulk Upload Questions"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>

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

      {/* Bulk Upload Modal */}
      <Modal
        open={showBulkUploadModal}
        onClose={handleCloseBulkUploadModal}
        aria-labelledby="bulk-upload-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2
              className="text-xl font-semibold text-gray-800"
              id="bulk-upload-modal-title"
            >
              Bulk Upload Questions
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Upload an Excel file (.xlsx or .xls) containing questions.</p>
                <p className="text-xs text-gray-500">
                  Make sure your Excel file follows the required format with proper columns for questions, options, and correct answers.
                </p>
              </div>

              <FormInput
                label="Select Excel File"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              {selectedExcelFile && (
                <div className="text-sm text-green-600">
                  Selected file: {selectedExcelFile.name}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseBulkUploadModal}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleBulkUpload}
                disabled={!selectedExcelFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Questions"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TriviaPage;