"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

type DataTableProps<T> = {
  rows: any;
  columns: GridColDef[];
  totalCount: number;
};

const Table = <T,>({ rows, columns, totalCount }: DataTableProps<T>) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <Paper
      style={{ height: 500, width: "100%" }}
      className="dark:bg-boxdark dark:text-white"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={totalCount}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        className="dark:bg-boxdark dark:text-white"
      />
    </Paper>
  );
};

export { Table };
