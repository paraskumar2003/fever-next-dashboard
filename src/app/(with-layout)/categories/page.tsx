"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components";
import { CategoryServices } from "@/services/category/category.service";
import CategorySection from "@/components/Section/CategorySection";
import CategoryModal from "@/components/Modal/CategoryModal";
import { useModal } from "@/hooks/useModal";
import { Category } from "@/components/List/CategoryList";
import { CategoryFormData } from "@/types/category";

type fetchCategoriesArgs =
  | { q?: string; page?: number; limit?: number }
  | undefined;

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const modal = useModal();

  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  const fetchCategories = async (args?: fetchCategoriesArgs) => {
    try {
      const { data } = await CategoryServices.getAllCategories({
        page: args?.page || paginationModel.page,
        limit: args?.limit || paginationModel.pageSize,
        ...(args?.q ? { q: args.q } : {}),
      });
      if (data?.data?.rows) {
        setCategories(data.data.rows);
        setRowCount(data.data.meta?.total || data.data.rows.length);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (searchString) {
      const timerId = setTimeout(() => {
        fetchCategories({
          q: searchString,
          page: paginationModel.page,
          limit: paginationModel.pageSize,
        });
      }, 500);
      return () => clearTimeout(timerId);
    } else {
      fetchCategories({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });
    }
  }, [searchString, paginationModel]);

  const handleCategoryView = (category: Category) => {
    setIsViewMode(true);
    setSelectedCategory(category);
    modal.open();
  };

  const handleCategoryEdit = (category: Category) => {
    setIsViewMode(false);
    setSelectedCategory(category);
    modal.open();
  };

  const handleCategoryDelete = async (id: number) => {
    try {
      await CategoryServices.deleteCategory(id.toString());
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setPaginationModel({
      page,
      pageSize,
    });
  };

  return (
    <>
      <div className="mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories Management</h1>
        </div>

        <div className="my-4">
          <SearchBar
            value={searchString}
            onChange={(text: string) => setSearchString(text)}
          />
        </div>

        <div className="space-y-6">
          <CategorySection
            categories={categories}
            onView={handleCategoryView}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onSave={async (formData: CategoryFormData) => {
              await fetchCategories();
            }}
            rowCount={rowCount}
            onPaginationModelChange={handlePaginationModelChange}
            paginationModel={paginationModel}
          />

          <CategoryModal
            isOpen={modal.isOpen}
            onClose={modal.close}
            categoryData={selectedCategory}
            isViewMode={isViewMode}
            onSave={async () => {
              await fetchCategories();
              modal.close();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
