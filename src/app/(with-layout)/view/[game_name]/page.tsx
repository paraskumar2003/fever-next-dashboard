"use client";

import { SearchBar } from "@/components";
import { Table } from "@/components/Tables";
import { TriviaServices } from "@/services";
import { Contest } from "@/types/contest";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Eye, SquarePen, Trash2 } from "lucide-react";

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
    { field: "contest_name", headerName: "Contest Name", width: 200 },
    { field: "contest_fee", headerName: "Contest Fee", width: 200 },
    {
      field: "contest_sponsor_logo",
      headerName: "Contest Sponsor Logo",
      width: 200,
      renderCell: (params: any) => (
        <>
          {params.value ? (
            <img
              src={params.value}
              alt="Sponsor Logo"
              style={{ width: 60, height: 40, objectFit: "contain" }}
            />
          ) : (
            <></>
          )}
        </>
      ),
      sortable: false,
      filterable: false,
    },
    { field: "contest_time", headerName: "Contest Time", width: 200 },
    { field: "contest_date", headerName: "Contest Date", width: 200 },
    { field: "contest_type", headerName: "Contest Type", width: 200 },
    {
      field: "sponsored_name",
      headerName: "Sponsor Name",
      width: 150,
    },
    // {
    //   field: "metrics",
    //   headerName: "Metrics",
    //   flex: 2,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params: { row: Contest }) => (
    //     <div className="flex h-full items-center justify-center gap-2">
    //       <Button
    //         variant="primary"
    //         color="primary"
    //         size="sm"
    //         onClick={() => handleAction("metrics", params.row.id as string)}
    //       >
    //         <ChartColumnBig />
    //       </Button>
    //     </div>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 300,
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
          {searchParams.get("category") !== "old" && (
            <Button
              variant="danger"
              color="error"
              size="sm"
              onClick={() => handleAction("delete", params.row.id)}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const { game_name } = useParams();
  const [rows, setRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let filter: Record<string, any> = {
          page: paginationModel.page,
          limit: paginationModel.pageSize,
        };
        filter.category = searchParams.get("category") ?? undefined;
        const { data } = await TriviaServices.getContests(filter);
        if (data.data.meta) setTotalCount(data.data?.meta?.total);
        if (data.data) {
          setRows(
            data.data.rows.map((e: Contest, index: number) => ({
              seq_no: index + 1,
              id: e.id,
              contest_name: e.name,
              contest_fee: e.contestFee,
              contest_sponsor_logo: e.sponsored_logo,
              contest_date: moment(new Date(e.startDate)).format("YYYY-MM-DD"),
              contest_time: moment(new Date(e.startDate)).format("HH:mm"),
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
  }, [searchParams, paginationModel]);

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
      <Table
        rows={rows}
        columns={columns}
        totalCount={totalCount}
        paginationModel={paginationModel}
        onPaginationModelChange={(e) => {
          console.log(e);
          setPaginationModel(e);
        }}
      />
    </div>
  );
}
