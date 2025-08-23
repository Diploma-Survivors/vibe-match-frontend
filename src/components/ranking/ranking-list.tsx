"use client";

import ContestFilter from "@/components/contest/contest-filter";
import type { ContestFilters } from "@/types/contest";
import { useState } from "react";

export default function RankingList() {
  const [filters, setFilters] = useState<ContestFilters>({
    id: "",
    name: "",
    status: "",
    participated: "",
  });

  const handleFiltersChange = (newFilters: ContestFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    // TODO: Implement search logic
  };

  const handleReset = () => {
    setFilters({
      id: "",
      name: "",
      status: "",
      participated: "",
    });
  };

  return (
    <ContestFilter
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  );
}
