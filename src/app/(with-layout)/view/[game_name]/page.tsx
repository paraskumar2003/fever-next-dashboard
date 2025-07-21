"use client";

import { SearchBar } from "@/components";
import ContestList from "@/components/List/ContestList";
import { TriviaServices, ContestServices } from "@/services";
import { Contest } from "@/types/contest";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import FormSection from "@/components/FormSection";
import Notiflix from "notiflix";

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

  const handleDuplicate = async (contest: Contest) => {
    try {
      const response = await ContestServices.duplicateContest(contest.id);

      if (response.data) {
        Notiflix.Notify.success("Contest duplicated successfully!");
        // Refresh the contests list
        await fetchContests();
      } else {
        Notiflix.Notify.failure(
          response.response?.message || "Failed to duplicate contest",
        );
      }
    } catch (error) {
      console.error("Error duplicating contest:", error);
      Notiflix.Notify.failure(
        "An error occurred while duplicating the contest",
      );
    }
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
    console.log("call for change", page, pageSize);
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
          paginationModel={paginationModel}
        />
      </FormSection>
    </div>
  );
}
