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
        ...args,
      });
      if (data?.data?.rows) {
        setCategories(data.data.rows);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (!searchString) {
      fetchCategories({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });
      return;
    }
    // Set a timer to delay the API call
    const timerId = setTimeout(() => {
      fetchCategories({
        q: searchString,
      });
    }, 500); // Adjust the delay (in milliseconds) as needed

    // Clear the timer if the user types again before the delay is over
    return () => {
      clearTimeout(timerId);
    };
  }, [searchString, paginationModel]); // Re-run the effect when searchString

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
      <SearchBar
        value={searchString}
        onChange={(text: string) => setSearchString(text)}
      />

      <div className="mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories Management</h1>
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
            rowCount={categories.length}
            onPaginationModelChange={handlePaginationModelChange}
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
