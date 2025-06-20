import { ContestData } from "@/app/gameplay/happening-quiz";

export interface Option {
  option_text: string;
  label?: string;
  id?: any;
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
}
