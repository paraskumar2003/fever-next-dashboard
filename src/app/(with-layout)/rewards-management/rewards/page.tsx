"use client";

import { SearchBar } from "@/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RewardServices } from "@/services/rewards/reward";
import { Reward } from "@/types/rewards";
import RewardSection from "@/components/Section/RewardSection";

export default function RewardsPage() {
  const searchParams = useSearchParams();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");

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
    // Implement view logic
  };

  const handleEdit = (reward: Reward) => {
    // Implement edit logic
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
    </div>
  );
}