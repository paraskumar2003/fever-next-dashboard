import React, { useState } from "react";
import QuestionSetRow from "./QuestionSetRow";
import ListWrapper from "./ListWrapper";
import { QuestionSet } from "@/types/questionSet";

interface QuestionSetListProps {
  questionSets: QuestionSet[];
  onEdit?: (questionSet: QuestionSet) => void;
  onDelete?: (id: number) => void;
  onView?: (questionSet: QuestionSet) => void;
  rowCount: number;
  onPaginationModelChange: (page: number, pageSize: number) => void;
  paginationModel: { page: number; pageSize: number };
}

const QuestionSetList: React.FC<QuestionSetListProps> = ({
  questionSets,
  onEdit,
  onDelete,
  onView,
  rowCount,
  onPaginationModelChange,
  paginationModel,
}) => {
  const handlePageSizeChange = (newPageSize: number) => {
    onPaginationModelChange(1, newPageSize);
  };

  const handleNextPage = () => {
    const nextPage = paginationModel.page + 1;
    onPaginationModelChange(nextPage, paginationModel.pageSize);
  };

  const handlePreviousPage = () => {
    const prevPage = paginationModel.page - 1;
    onPaginationModelChange(prevPage, paginationModel.pageSize);
  };

  const canGoNext =
    (paginationModel.page - 1) * paginationModel.pageSize +
      questionSets.length <
    rowCount;
  const canGoPrevious = paginationModel.page > 1;

  const startItem = (paginationModel.page - 1) * paginationModel.pageSize + 1;
  const endItem = Math.min(
    rowCount,
    paginationModel.page * paginationModel.pageSize,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      <ListWrapper>
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
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Questions Count
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questionSets.map((questionSet, index) => (
                <QuestionSetRow
                  key={questionSet.id}
                  index={
                    (paginationModel.page - 1) * paginationModel.pageSize +
                    index
                  }
                  questionSet={questionSet}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>

          {questionSets.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No question sets found
            </div>
          )}
        </div>
      </ListWrapper>

      {/* Pagination Controls */}
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
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{rowCount}</span> results
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <select
                id="pageSize"
                value={paginationModel.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
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

export default QuestionSetList;
