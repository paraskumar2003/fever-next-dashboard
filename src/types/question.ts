export interface Answer {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answer: string;
  is_correct: boolean;
  status: string;
}

export interface QuestionCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
}

export interface QuestionSetDetails {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  question: string;
  correct_answer: string;
  status: number;
  category: QuestionCategory;
  questionOptions: Answer[];
  set: QuestionSetDetails;
  // Additional computed properties for backward compatibility
  categoryName?: string;
  categoryId?: number;
  setName?: string;
}