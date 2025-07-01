import { Question } from "./question";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface QuestionSet {
  id: number;
  name: string;
  description: string;
  questions: Question[];
  category: Category;
}

export interface QuestionSetFormData {
  name: string;
  description: string;
  categoryId: number;
}