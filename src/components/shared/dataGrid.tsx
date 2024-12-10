import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

interface TableComponentProps<T> {
    rows: T[];
    columns: GridColDef[];
    rowCount: number;
    page: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    loading?: boolean; // Optional loading state
    className?: string; // Optional additional styling
}

const TableComponent = <T extends { id: number | string }>({
    rows,
    columns,
    rowCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    loading = false,
    className = '',
}: TableComponentProps<T>) => {
    // }) => {
    return (
        <Paper
            sx={{
                height: 'auto',
                width: '100%',
                padding: '20px',
                paddingBottom: '30px',
            }}
            className={className}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                rowCount={rowCount}
                paginationMode="server"
                paginationModel={{ page: page - 1, pageSize }}
                onPaginationModelChange={(newModel: GridPaginationModel) => {
                    onPageChange(newModel.page + 1);
                    onPageSizeChange(newModel.pageSize);
                }}
                pageSizeOptions={[5, 10, 25]}
                sx={{
                    border: 0,
                    color: '#616161',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#616161',
                        color: '#ffffff',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontSize: '14px',
                        color: '#616161',
                        fontWeight: 'bold',
                    },
                }}
            />
        </Paper>
    );
};

export default TableComponent;
