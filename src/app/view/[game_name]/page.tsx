"use client";

import { PageLayout } from "@/components";
import { Table } from "@/components/Tables";
import { useParams } from "next/navigation";
import { useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 30 },
  { field: "contest_name", headerName: "Contest Name", flex: 1 },
  { field: "contest_fee", headerName: "Contest Fee", flex: 1 },
  {
    field: "contest_sponsor_logo",
    headerName: "Contest Sponsor Logo",
    flex: 1,
  },
  { field: "contest_time", headerName: "Contest Time", flex: 1 },
  { field: "contest_date", headerName: "Contest Date", flex: 1 },
];

const tempRows = [
  {
    id: 1,
    contest_name: "Tambola Mega Jackpot",
    contest_fee: 100,
    contest_sponsor_logo: "https://example.com/logo1.png",
    contest_date: "2024-07-10",
    contest_time: "18:30",
  },
  {
    id: 2,
    contest_name: "Weekend Housie Bonanza",
    contest_fee: 50,
    contest_sponsor_logo: "https://example.com/logo2.png",
    contest_date: "2024-07-13",
    contest_time: "20:00",
  },
  {
    id: 3,
    contest_name: "Super Saturday Tambola",
    contest_fee: 75,
    contest_sponsor_logo: "https://example.com/logo3.png",
    contest_date: "2024-07-20",
    contest_time: "19:00",
  },
  {
    id: 4,
    contest_name: "Festival Special Housie",
    contest_fee: 120,
    contest_sponsor_logo: "https://example.com/logo4.png",
    contest_date: "2024-07-25",
    contest_time: "21:00",
  },
  {
    id: 5,
    contest_name: "Daily Fun Tambola",
    contest_fee: 30,
    contest_sponsor_logo: "https://example.com/logo5.png",
    contest_date: "2024-07-30",
    contest_time: "17:00",
  },
];

export default function ViewContest() {
  const { game_name } = useParams();

  console.log(game_name);

  const [rows, setRows] = useState<any>(tempRows);

  return (
    <PageLayout>
      <div className="min-h-screen p-8">
        <h1 className="mb-8 text-xl">
          Contest Overview - (&nbsp;
          {String(game_name).charAt(0).toUpperCase() +
            String(game_name).slice(1).toLowerCase()}
          &nbsp;)
        </h1>
        <Table rows={rows} columns={columns} totalCount={rows.length} />
      </div>
    </PageLayout>
  );
}
