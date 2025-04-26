import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import QuestionRow from "./QuestionRow";

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
  status: string;
}

interface Question {
  id: number;
  question: string;
  correct_answer: string;
  status: number;
  answers: Answer[];
}

interface QuestionListProps {
  questions: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (id: number) => void;
  onView?: (question: Question) => void;
  onStatusChange?: (id: number, status: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Question
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Correct Answer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>

        {questions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No questions found
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
