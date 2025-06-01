"use client";

import { SearchBar } from "@/components";
import { Table } from "@/components/Tables";
import { Contest } from "@/types/contest";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { CouponServices } from "@/services/rewards/coupon";
import { Coupon } from "@/types/coupon";

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
    { field: "brand_name", headerName: "Brand Name", flex: 1 },
    { field: "coupon_code", headerName: "Coupon Code", flex: 1 },
    { field: "type", headerName: "Coupon Type", flex: 1 },
    { field: "coupon_attachment", headerName: "Attachment", flex: 1 },
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

  const fetchData = async (props?: Record<string, any>) => {
    try {
      const { data } = await CouponServices.getCoupons(props || {});
      if (data?.data?.rows) {
        setRows(
          data.data.rows.map((e: Coupon, index: number) => ({
            seq_no: index + 1,
            id: e.id,
            brand_name: e.brand_name,
            coupon_code: e.coupon_code,
            type: e.type,
            coupon_attachment: e.coupon_attachment,
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
      <h1 className="mb-8 text-xl">Coupons Overview</h1>
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
