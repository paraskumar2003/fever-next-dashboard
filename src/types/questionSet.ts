export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface QuestionSet {
  id: number;
  name: string;
  description: string;
  questions: any[];
  category: Category;
}

export interface QuestionSetFormData {
  name: string;
  description: string;
  categoryId: number;
}