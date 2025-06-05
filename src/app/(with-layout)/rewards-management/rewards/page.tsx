"use client";

import { SearchBar } from "@/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RewardServices } from "@/services/rewards/reward";
import { Reward } from "@/types/rewards";
import RewardSection from "@/components/Section/RewardSection";
import { useModal } from "@/hooks/useModal";
import RewardModal from "@/components/Modal/RewardModal";

export default function RewardsPage() {
  const searchParams = useSearchParams();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const modal = useModal();

  const fetchRewards = async (props?: {
    page?: number;
    pageSize?: number;
    q?: string;
  }) => {
    try {
      const { data } = await RewardServices.getRewards(props);
      if (data?.data) {
        setRewards(data.data.rows);
        setRowCount(data.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      const timerId = setTimeout(() => {
        fetchRewards({ q: search });
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      fetchRewards();
    }
  }, [search]);

  const handleView = (reward: Reward) => {
    setSelectedReward(reward);
    setIsViewMode(true);
    modal.open();
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setIsViewMode(false);
    modal.open();
  };

  const handleDelete = async (id: string) => {
    // Implement delete logic
  };

  const handlePaginationModelChange = (page: number) => {
    fetchRewards({ page });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-xl">Rewards Management</h1>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search rewards..."
      />
      <div className="py-2"></div>
      <RewardSection
        rewards={rewards}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowCount={rowCount}
        onPaginationModelChange={handlePaginationModelChange}
        onSave={async () => {
          await fetchRewards();
        }}
      />

      <RewardModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        rewardData={selectedReward}
        isViewMode={isViewMode}
        onSave={async () => {
          await fetchRewards();
          modal.close();
        }}
      />
    </div>
  );
}
