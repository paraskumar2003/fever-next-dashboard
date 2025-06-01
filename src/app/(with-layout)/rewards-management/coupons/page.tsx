"use client";

import { SearchBar } from "@/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CouponServices } from "@/services/rewards/coupon";
import { Coupon } from "@/types/coupon";
import CouponSection from "@/components/Section/CouponSection";

export default function CouponsPage() {
  const searchParams = useSearchParams();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");

  const fetchCoupons = async (props?: {
    page?: number;
    pageSize?: number;
    q?: string;
  }) => {
    try {
      const { data } = await CouponServices.getCoupons(props || {});
      if (data?.data) {
        setCoupons(data.data.rows);
        setRowCount(data.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      const timerId = setTimeout(() => {
        fetchCoupons({ q: search });
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      fetchCoupons();
    }
  }, [search]);

  const handleView = (coupon: Coupon) => {
    // Implement view logic
  };

  const handleEdit = (coupon: Coupon) => {
    // Implement edit logic
  };

  const handleDelete = async (id: number) => {
    // Implement delete logic
  };

  const handlePaginationModelChange = (page: number) => {
    fetchCoupons({ page });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-xl">Coupons Management</h1>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search coupons..."
      />
      <div className="py-2"></div>
      <CouponSection
        coupons={coupons}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowCount={rowCount}
        onPaginationModelChange={handlePaginationModelChange}
        onSave={async () => {
          await fetchCoupons();
        }}
      />
    </div>
  );
}