"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

type DataTableProps<T> = {
  rows: any;
  columns: GridColDef[];
  totalCount: number;
  onPaginationModelChange?: (paginationModel: any) => void;
  paginationModel: { page: number; pageSize: number };
};

const Table = <T,>({
  rows,
  columns,
  totalCount,
  onPaginationModelChange,
  paginationModel,
}: DataTableProps<T>) => {
  return (
    <Paper
      style={{ height: 500, width: "100%" }}
      className="dark:bg-boxdark dark:text-white"
    >
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalCount}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          className="dark:bg-boxdark dark:text-white"
        />
      </div>
    </Paper>
  );
};

export { Table };
