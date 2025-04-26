import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { format } from "date-fns";

interface Instruction {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface InstructionRowProps {
  instruction: Instruction;
  onEdit?: (instruction: Instruction) => void;
  onDelete?: (id: string) => void;
  onView?: (instruction: Instruction) => void;
}

const InstructionRow: React.FC<InstructionRowProps> = ({
  instruction,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{instruction.id}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-[200px] truncate">{instruction.title}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-[300px] truncate">{instruction.description}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {format(new Date(instruction.updatedAt), "MMM dd, yyyy HH:mm")}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(instruction)}
            title="View Instruction"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(instruction)}
            title="Edit Instruction"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(instruction.id)}
            title="Delete Instruction"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default InstructionRow;
