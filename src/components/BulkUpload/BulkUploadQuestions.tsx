import React, { useState, useEffect } from "react";
import { CheckCircle, Download, Upload, X } from "lucide-react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { SearchBar } from "../Forms";
import { CategoryServices, TriviaServices } from "@/services";
import { QuestionSetServices } from "@/services/trivia/sets.service";
import { Category } from "@/types/category";
import Notiflix from "notiflix";

interface QuestionSet {
  id: number;
  name: string;
  description: string;
}

interface BulkUploadQuestionsProps {
  searchString: string;
  onSearchChange: (text: string) => void;
  onUploadSuccess?: () => void;
}

const BulkUploadQuestions: React.FC<BulkUploadQuestionsProps> = ({
  searchString,
  onSearchChange,
  onUploadSuccess,
}) => {
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedQuestionsCount, setUploadedQuestionsCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await CategoryServices.getAllCategories({});
        if (data?.data) {
          setCategories(data.data.rows);
          // Set first category as default
          if (data.data.rows.length > 0) {
            setSelectedCategoryId(data.data.rows[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      if (selectedCategoryId) {
        try {
          const { data } =
            await QuestionSetServices.getQuestionSetsByCategoryId(
              selectedCategoryId,
            );
          if (data?.data?.rows) {
            setQuestionSets(data.data.rows);
            // Set first question set as default
            if (data.data.rows.length > 0) {
              setSelectedSetId(data.data.rows[0].id);
            } else {
              setSelectedSetId(null);
            }
          } else {
            setQuestionSets([]);
            setSelectedSetId(null);
          }
        } catch (error) {
          console.error("Error fetching question sets:", error);
          setQuestionSets([]);
          setSelectedSetId(null);
        }
      }
    };

    fetchQuestionSets();
  }, [selectedCategoryId]);

  const handleBulkUploadClick = () => {
    setShowBulkUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        Notiflix.Notify.failure(
          "Please select a valid Excel file (.xlsx or .xls)",
        );
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

    if (!selectedCategoryId) {
      Notiflix.Notify.failure("Please select a category");
      return;
    }

    if (!selectedSetId) {
      Notiflix.Notify.failure("Please select a question set");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("excel", selectedExcelFile);
      formData.append("category_id", selectedCategoryId.toString());
      formData.append("set_id", selectedSetId.toString());

      const response = await TriviaServices.bulkUploadQuestions(formData);

      if (response.data) {
        let insertedQuestions = response.data.data?.inserted || 0;
        setUploadSuccess(true);
        setUploadedQuestionsCount(insertedQuestions);
        
        Notiflix.Notify.success("Questions uploaded successfully!");
        setShowBulkUploadModal(false);
        setSelectedExcelFile(null);
        // Call the success callback to refresh the questions list
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        Notiflix.Notify.failure(
          response.response?.message || "Failed to upload questions",
        );
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
    setUploadSuccess(false);
    setUploadedQuestionsCount(0);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategoryId(categoryId);
    setSelectedSetId(null); // Reset set selection when category changes
  };

  const handleSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const setId = parseInt(e.target.value);
    setSelectedSetId(setId);
  };

  const handleBulkDownloadClick = () => {
    const link = document.createElement("a");
    link.href = "/files/questions-sample.xlsx"; // relative to the public folder
    link.download = "sample.xlsx"; // desired file name for download
    link.click();
  };

  return (
    <>
      <div className="my-4 flex items-center gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchString}
            onChange={onSearchChange}
            placeholder="Seach By Category, Question Set or Question..."
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkDownloadClick}
          title="Download Sample File"
          className="flex items-center gap-2 p-1"
        >
          <Download className="h-4 w-4" />
          <span className="pl-1">Sample File</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkUploadClick}
          title="Bulk Upload Questions"
          className="flex items-center gap-2 p-1"
        >
          <Upload className="h-4 w-4" />
          <span className="pl-1">Bulk Upload</span>
        </Button>
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
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-semibold text-gray-800"
                id="bulk-upload-modal-title"
              >
                Bulk Upload Questions
              </h2>
              <button
                onClick={handleCloseBulkUploadModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {uploadSuccess ? (
                <div className="space-y-4 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium text-gray-800">
                    {uploadedQuestionsCount} Questions Uploaded Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your question file was uploaded and processed successfully.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleCloseBulkUploadModal}>Close</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        Upload an Excel file (.xlsx or .xls) containing questions.
                      </p>
                      <p className="text-xs text-gray-500">
                        Make sure your Excel file follows the required format with
                        proper columns for questions, options, and correct answers.
                      </p>
                    </div>
                    <FormSelect
                      label="Category"
                      value={selectedCategoryId?.toString() || ""}
                      onChange={handleCategoryChange}
                      options={[
                        { value: "", label: "Select a category" },
                        ...categories.map((category) => ({
                          value: category.id.toString(),
                          label: `${category.name} - ${category.questions.length} Questions`,
                        })),
                      ]}
                      disabled={isUploading}
                      required
                    />
                    <FormSelect
                      label="Question Set"
                      value={selectedSetId?.toString() || ""}
                      onChange={handleSetChange}
                      options={[
                        { value: "", label: "Select a question set" },
                        ...questionSets.map((questionSet) => ({
                          value: questionSet.id.toString(),
                          label: questionSet.name,
                        })),
                      ]}
                      disabled={isUploading || questionSets.length === 0}
                      required
                    />
                    <FormInput
                      label="Select Excel File"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      required
                    />
                    {selectedExcelFile && (
                      <div className="text-sm text-green-600">
                        Selected file: {selectedExcelFile.name}
                      </div>
                    )}
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
                        disabled={
                          !selectedExcelFile ||
                          !selectedCategoryId ||
                          !selectedSetId ||
                          isUploading
                        }
                      >
                        {isUploading ? "Uploading..." : "Upload Questions"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkUploadQuestions;
