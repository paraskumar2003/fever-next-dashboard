import { ContestData } from "@/app/gameplay/happening-quiz";
import { ContestFormData } from "@/types";

export interface Option {
  option_text: string;
  label?: string;
  id?: any;
  is_correct?: boolean; // Add this property for actual validation
}

export interface Question {
  timer: number;
  question_no: number;
  question_text: string;
  options: Option[];
}

export interface TriviaGamePlayProps {
  questions: Question[] | [];
  timeOut?: number;
  flip?: number;
  onComplete?: Function;
  onExit?: Function;
  addNewQuestion: (question: Question) => void;
  contestData?: ContestData;
  onPublish?: () => void;
  formData?: Partial<ContestFormData>;
}
