"use client";

import { SearchBar } from "@/components";
import { Table } from "@/components/Tables";
import { TriviaServices } from "@/services";
import { Contest } from "@/types/contest";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { ChartColumnBig, Eye, SquarePen, Trash2 } from "lucide-react";

export default function ViewContest() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const handleMetricsModal = (contest_id: string | number) => {};

  const handleAction = (
    action: "view" | "edit" | "delete" | "metrics",
    contest_id: string | number,
  ) => {
    if (action == "view")
      router.push(`/${params.game_name}?contest_id=${contest_id}`);
    if (action == "edit")
      router.push(`/${params.game_name}?contest_id=${contest_id}`);
    if (action == "metrics") handleMetricsModal(contest_id);
  };

  const columns = [
    { field: "seq_no", headerName: "ID", width: 30 },
    { field: "nama", headerName: "Reward Name", flex: 1 },
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

  const { game_name } = useParams();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let filter: Record<string, any> = {};
        filter.category = searchParams.get("category") ?? undefined;
        const { data } = await TriviaServices.getContests(filter);
        if (data.data) {
          setRows(
            data.data.rows.map((e: Contest, index: number) => ({
              seq_no: index + 1,
              id: e.id,
              contest_name: e.name,
              contest_fee: e.contestFee,
              contest_sponsor_logo: e.sponsored_logo,
              contest_date: moment(new Date(e.createdAt)).format("YYYY-MM-DD"),
              contest_time: moment(new Date(e.createdAt)).format("HH:mm"),
              sponsored_name: e.sponsored_name,
              contest_type: e.contestTypeName,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Search term:", search);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-xl">
        Contest Overview - (&nbsp;
        {String(game_name).charAt(0).toUpperCase() +
          String(game_name).slice(1).toLowerCase()}
        &nbsp;)
      </h1>
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
