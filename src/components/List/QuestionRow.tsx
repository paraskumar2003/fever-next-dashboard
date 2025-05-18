import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { Question } from "./QuestionList";

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
  status: string;
}

interface QuestionRowProps {
  question: Question;
  index: number;
  onEdit?: (question: Question) => void;
  onDelete?: (id: number) => void;
  onView?: (question: Question) => void;
  onStatusChange?: (id: number, status: number) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  index,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusToggle = async () => {
    try {
      setLoadingStatus(true);
      const newStatus = question.status === 1 ? 0 : 1;
      await onStatusChange?.(question.id, newStatus);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-md truncate">{question.question}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {question.correct_answer}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {question.categoryName}
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={handleStatusToggle}
          disabled={loadingStatus}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            loadingStatus
              ? "cursor-wait bg-gray-100 text-gray-400"
              : question.status === 1
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {loadingStatus
            ? "Updating..."
            : question.status === 1
              ? "Active"
              : "Inactive"}
        </button>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(question)}
            title="View Question"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(question)}
            title="Edit Question"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(question.id)}
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default QuestionRow;
