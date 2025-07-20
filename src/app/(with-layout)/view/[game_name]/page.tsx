"use client";

import { SearchBar } from "@/components";
import ContestList from "@/components/List/ContestList";
import { TriviaServices } from "@/services";
import { Contest } from "@/types/contest";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";

export default function ViewContest() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [contests, setContests] = useState<Contest[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  const handleView = (contest: Contest) => {
    router.push(`/${params.game_name}?contest_id=${contest.id}`);
  };

  const handleEdit = (contest: Contest) => {
    router.push(`/${params.game_name}?contest_id=${contest.id}`);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete contest:", id);
  };

  const handleDuplicate = (contest: Contest) => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate contest:", contest);
  };

  const { game_name } = useParams();

  const fetchContests = async () => {
    setLoading(true);
    try {
      let filter: Record<string, any> = {
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      };
      
      if (search) {
        filter.q = search;
      }
      
      filter.category = searchParams.get("category") ?? undefined;
      
      const { data } = await TriviaServices.getContests(filter);
      
      if (data?.data?.meta) {
        setTotalCount(data.data.meta.total);
      }
      
      if (data?.data?.rows) {
        setContests(data.data.rows);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      const timerId = setTimeout(() => {
        fetchContests();
      }, 500);
      return () => clearTimeout(timerId);
    } else {
      fetchContests();
    }
  }, [search, paginationModel, searchParams]);

  const handlePaginationModelChange = (page: number, pageSize: number) => {
    setPaginationModel({ page, pageSize });
  };

  const handleSearch = () => {
    console.log("Search term:", search);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Contest Overview - (
          {String(game_name).charAt(0).toUpperCase() +
            String(game_name).slice(1).toLowerCase()}
          )
        </h1>
      </div>

      <div className="my-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={handleSearch}
          placeholder="Search contests..."
        />
      </div>

      <FormSection title="Contests">
        <ContestList
          contests={contests}
          category={searchParams.get("category") || undefined}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          rowCount={totalCount}
          onPaginationModelChange={handlePaginationModelChange}
        />
      </FormSection>
    </div>
  );
}
