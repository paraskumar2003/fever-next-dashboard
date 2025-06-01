export interface Reward {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  reward_type: "PHYSICAL" | "DIGITAL";
  name: string;
}
