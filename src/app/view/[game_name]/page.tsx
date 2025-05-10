"use client";

import { PageLayout, SearchBar } from "@/components";
import { Table } from "@/components/Tables";
import { TriviaServices } from "@/services";
import { Contest } from "@/types/contest";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

export default function ViewContest() {
  const router = useRouter();
  const params = useParams();

  const handleAction = (
    action: "view" | "edit" | "delete",
    contest_id: string | number,
  ) => {
    if (action == "view")
      router.push(`/${params.game_name}?contest_id=${contest_id}`);
    if (action == "edit")
      router.push(`/${params.game_name}?contest_id=${contest_id}`);
  };

  const columns = [
    { field: "seq_no", headerName: "ID", width: 30 },
    { field: "contest_name", headerName: "Contest Name", flex: 1 },
    { field: "contest_fee", headerName: "Contest Fee", flex: 1 },
    {
      field: "contest_sponsor_logo",
      headerName: "Contest Sponsor Logo",
      flex: 1,
    },
    { field: "contest_time", headerName: "Contest Time", flex: 1 },
    { field: "contest_date", headerName: "Contest Date", flex: 1 },
    { field: "contest_type", headerName: "Contest Type", flex: 1 },
    { field: "sponsored_name", headerName: "Sponsor Name", flex: 1 },
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
            View
          </Button>
          <Button
            variant="secondary"
            color="secondary"
            size="sm"
            onClick={() => handleAction("edit", params.row.id as string)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            color="error"
            size="sm"
            onClick={() => handleAction("delete", params.row.id)}
          >
            Delete
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
        const { data } = await TriviaServices.getContests();
        if (data.data) {
          setRows(
            data.data.map((e: Contest, index: number) => ({
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
  }, []);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Search term:", search);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
