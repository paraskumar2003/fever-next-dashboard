import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";
import { Category } from "./CategoryList";

interface CategoryRowProps {
  category: Category;
  index: number;
  onEdit?: (category: Category) => void;
  onDelete?: (id: number) => void;
  onView?: (category: Category) => void;
  onStatusChange?: (id: number, status: number) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  index,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-600">#{index + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="font-medium">{category.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-md truncate">{category.description}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {category.questions?.length || 0}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(category)}
            title="View Category"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(category)}
            title="Edit Category"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(category.id)}
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;