import React from "react";
import InstructionRow from "./InstructionRow";

interface Instruction {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface InstructionListProps {
  instructions: Instruction[];
  onEdit?: (instruction: Instruction) => void;
  onDelete?: (id: string) => void;
  onView?: (instruction: Instruction) => void;
}

const InstructionList: React.FC<InstructionListProps> = ({
  instructions,
  onEdit,
  onDelete,
  onView,
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
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Last Updated
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {instructions.map((instruction) => (
              <InstructionRow
                key={instruction.id}
                instruction={instruction}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>

        {instructions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No instructions found
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionList;
