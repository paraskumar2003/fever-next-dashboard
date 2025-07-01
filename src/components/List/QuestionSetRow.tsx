import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { QuestionSet } from "@/types/questionSet";

interface QuestionSetRowProps {
  questionSet: QuestionSet;
  index: number;
  onEdit?: (questionSet: QuestionSet) => void;
  onDelete?: (id: number) => void;
  onView?: (questionSet: QuestionSet) => void;
}

const QuestionSetRow: React.FC<QuestionSetRowProps> = ({
  questionSet,
  index,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{questionSet.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-md truncate">{questionSet.description}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {questionSet.category?.name || "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {questionSet.questions?.length || 0}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(questionSet)}
            title="View Question Set"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(questionSet)}
            title="Edit Question Set"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(questionSet.id)}
            title="Delete Question Set"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default QuestionSetRow;