import { Reward } from "./rewards";

export interface Contest {
  id: string;
  createdAt: string; // or Date if you'll parse it
  updatedAt: string; // or Date if you'll parse it
  deletedAt: string | null; // or Date | null if you'll parse it
  name: string;
  startDate: string; // or Date
  endDate: string; // or Date
  rewards: Reward;
  thumbnail: string;
  isPublished: boolean;
  songsCnt: number;
  contestPayment: string;
  contestImage: string;
  contestFee: number;
  contestTypeName: string; // consider using enum if you have fixed values
  contestType: string; // consider using enum if you have fixed values
  isSponsored: boolean;
  sponsored_name: string;
  sponsored_logo: string;
  status: number; // 0 for Draft, 1 for Active, 2 for Inactive
}
