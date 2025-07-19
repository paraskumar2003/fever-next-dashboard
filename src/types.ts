import { Reward } from "./types/rewards";

export interface GradientColor {
  direction: "to-right" | "to-left" | "to-top" | "to-bottom";
  start: string;
  end: string;
}

export interface GameProceed {
  submitBtn: string;
  Tnc?: string;
}

export interface Instruction {
  title?: string;
  description?: string;
}

export interface PrizeCatalogue {
  prize_name: string;
  text_color: string;
  gradient_color: GradientColor;
  background_color: string;
  image: string;
  quantity?: number;
  fever_bucks?: number;
  rewards?: string;
  coupon_type?: string;
  prize_type?: "reward" | "fever_bucks" | "voucher";
}

export interface TambolaPrizeCatalogue {
  prize_name: string;
  text_color: string;
  gradient_color: GradientColor;
  background_color: string;
  image: string;
  prize_type:
    | "Full House"
    | "First Line"
    | "Second Line"
    | "Third Line"
    | "Corner"
    | "Early 5";
}

export interface Question {
  id?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: "option1" | "option2" | "option3" | "option4";
  timer: string;
}

export interface QuestionSet {
  id: number;
  name: string;
  questions: string;
}

export type RewardType = "PHYSICAL" | "COUPON_PDF" | "CODE";

export interface WinnerReward {
  reward_id: number;
  bucks: number;
  qty: number;
}

export interface ContestFormData {
  contest_id: number;
  contest_name: string;
  reward_name: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  contest_type: "FREE" | "PAID";
  contest_fee?: number;
  contest_type_name?: string;
  contest_variant_name?: string;
  sponsor_name: string;
  sponsor_logo: string;
  sponsor_logo_preview: string;
  thumbnail: string;
  thumbnail_preview: string;
  contest_image: string;
  contest_image_preview: string;
  contest_hero_logo: string;
  contest_hero_logo_preview: string;
  game_proceed: GameProceed;
  instructions: Instruction[];
  prize_catalogue: PrizeCatalogue[];
  questions: Question[];
  title: string;
  description: string;
  winners: WinnerReward[];
  mega_prize_name: string;
  game_timer: string;
  game_time_level: "GAME" | "QUESTION";
  flip_allowed: number;
  flip_count: number;
  flip_fee: number;
  flip_set: { name: string; questions: Question[] };
  QuestionCategoryId: number;
  flipSet: number;
  isPopular: number;
  set_id: number;
  contestPrizes: ContestPrizeItem[];
  fever_logo: boolean;
  QuestionCount: number;
}

export interface ContestPrizeItem {
  id: number;
  prize_name: string;
  current_quantity: number;
  quantity: number;
  fever_bucks: number;
  reward: Reward;
  coupon_type: string | null;
}

export interface TambolaFormData {
  contest_name: string;
  reward_name: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  contest_type: "FREE" | "PAID";
  contest_fee?: number;
  contest_type_name?: string;
  contest_entry_note: string;
  contest_variant_name?: string;
  sponsor_name: string;
  sponsor_logo: string;
  thumbnail: string;
  contest_image: string;
  contest_hero_logo: string;
  prize_description: string;
  game_proceed: GameProceed;
  instructions?: Instruction[];
  prize_catalogue: TambolaPrizeCatalogue[];
  questions: Question[];
  title: string;
  description: string;
}
