"use client";

import { SearchBar } from "@/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RewardServices } from "@/services/rewards/reward";
import { Reward } from "@/types/rewards";
import RewardList from "@/components/List/RewardList";
import Button from "@/components/Button";
import { Plus } from "lucide-react";

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rewards Management</h1>
        <Button variant="primary" onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Reward
        </Button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search rewards..."
      />

      <div className="mt-6">
        <RewardList
          rewards={rewards}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          rowCount={rowCount}
          onPaginationModelChange={handlePaginationModelChange}
        />
      </div>
    </div>
  );
}