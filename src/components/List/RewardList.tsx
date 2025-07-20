import React, { useState } from "react";
import RewardRow from "./RewardRow";
import { Reward } from "@/types/rewards";

interface RewardListProps {
  rewards: Reward[];
  onEdit?: (reward: Reward) => void;
  onDelete?: (id: string) => void;
  onView?: (reward: Reward) => void;
  rowCount: number;
  onPaginationModelChange: (page: number) => void;
}

const RewardList: React.FC<RewardListProps> = ({
  rewards,
  onEdit,
  onDelete,
  onView,
  rowCount,
  onPaginationModelChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    onPaginationModelChange(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    onPaginationModelChange(prevPage);
  };

  const canGoNext = (currentPage - 1) * pageSize + rewards.length < rowCount;
  const canGoPrevious = currentPage > 1;

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
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Brand Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Reward Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Total Coupons
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Used Coupons
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Created At
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rewards.map((reward, index) => (
              <RewardRow
                key={reward.id}
                index={index}
                reward={reward}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>

        {rewards.length === 0 && (
          <div className="py-8 text-center text-gray-500">No rewards found</div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={handlePreviousPage}
            disabled={!canGoPrevious}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!canGoNext}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(rowCount, currentPage * pageSize)}
              </span>{" "}
              of <span className="font-medium">{rowCount}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={handlePreviousPage}
                disabled={!canGoPrevious}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextPage}
                disabled={!canGoNext}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardList;
