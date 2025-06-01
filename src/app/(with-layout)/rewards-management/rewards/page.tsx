"use client";

import { SearchBar } from "@/components";
import { Table } from "@/components/Tables";
import { Contest } from "@/types/contest";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { RewardServices } from "@/services/rewards/reward";
import { Reward } from "@/types/rewards";

export default function ViewContest() {
  const searchParams = useSearchParams();

  const handleAction = (
    action: "view" | "edit" | "delete" | "metrics",
    reward_id: string | number,
  ) => {
    if (action == "view") {
    }

    if (action == "edit") {
    }

    if (action == "metrics") {
    }
  };

  const columns = [
    { field: "seq_no", headerName: "ID", width: 30 },
    { field: "name", headerName: "Reward Name", flex: 1 },
    { field: "reward_type", headerName: "Reward Type", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: Contest }) => (
        <div className="flex h-full items-center justify-center gap-2">
          <Button
            variant="primary"
            color="primary"
            size="sm"
            onClick={() => handleAction("view", params.row.id as string)}
          >
            <Eye />
          </Button>
          <Button
            variant="secondary"
            color="secondary"
            size="sm"
            onClick={() => handleAction("edit", params.row.id as string)}
          >
            <SquarePen className="text-xs" />
          </Button>
          <Button
            variant="danger"
            color="error"
            size="sm"
            onClick={() => handleAction("delete", params.row.id)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (props?: {
    page?: number;
    pageSize?: number;
    q?: string;
  }) => {
    try {
      const { data } = await RewardServices.getRewards(props); // Use props if needed
      if (data?.data?.rows) {
        setRows(
          data.data.rows.map((e: Reward, index: number) => ({
            seq_no: index + 1,
            id: e.id,
            name: e.name,
            reward_type: e.reward_type,
            createdAt: moment(e.createdAt).format("YYYY-MM-DD"),
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Search term:", search);
  };

  useEffect(() => {
    if (search) {
      const timerId = setTimeout(() => {
        fetchData({
          q: search,
        });
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      fetchData();
    }
  }, [search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-xl">Reward Overview</h1>
      <SearchBar
        value={search}
        onChange={setSearch}
        onSubmit={handleSearch}
        placeholder="Search items..."
      />
      <div className="py-2"></div>
      <Table rows={rows} columns={columns} totalCount={rows.length} />
    </div>
  );
}
