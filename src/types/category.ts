import { Question } from "./question";

export interface Category {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface CategoryFormData {
  name: string;
  description: string;
}