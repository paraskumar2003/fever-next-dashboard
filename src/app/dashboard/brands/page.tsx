'use client'
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@/components/ui/button';

const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 100 },
    {
        field: "vendor_id",
        headerName: "Vendor Id",
        width: 150,
    },
    {
        field: "product_id",
        headerName: "Product Id",
        width: 150,
    },
    {
        field: "mrp",
        headerName: "MRP",
        width: 150,
    },
    {
        field: "atsCost",
        headerName: "ATS Cost",
        width: 150,
    },
    {
        field: "clientCost",
        headerName: "Client Cost",
        width: 150,
    },
    {
        field: "amount",
        headerName: "Amount",
        width: 150,
    },
    {
        field: "discount",
        headerName: "Discount",
        width: 150,
    },
    {
        field: "status",
        headerName: "Status",
        width: 200,
    },
    {
        field: "brand_name",
        headerName: "Brand Name",
        width: 250,
    },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        width: 200,
    },
    {
        field: 'view',
        headerName: 'View',
        sortable: false,
        renderCell: () => (
            <Button className='btn bg-yellow-600'
            // style={{ padding: "5px 10px" }}
            // onClick={() => handleViewClick(params.row)}
            >
                <i className="fa-solid fa-eye"></i>
            </Button>
        ),
    },

    {
        field: 'update_product',
        headerName: 'Update',
        sortable: false,
        renderCell: () => (
            <Button className='btn bg-green-800' style={{ padding: "5px 10px" }}
            //  onClick={() => handleUpdateProduct(params.row)}
            >
                Update</Button>
        ),
    },
    {
        field: 'delete_product',
        headerName: 'Delete',
        sortable: false,
        renderCell: () => (
            <Button className='btn bg-red-700' style={{ padding: "5px 10px" }}
            //  onClick={() => handleDeleteProduct(params.row)}
            >Delete</Button>
        ),
    },

];

const rows = [
    { id: 1, transaction_id: 2345, mobile: 7234453643, services: 'Jon', product: 35, provider: 'RCB', quantity: 57, amount: 9876, created: '12-04-2024', status: 'pending' },
    { id: 2, transaction_id: 2376, mobile: 7234453643, services: 'Cersei', product: 42, provider: 'KRM', quantity: 65, amount: 2345, created: '12-04-2024', status: 'pending' },
    { id: 3, transaction_id: 2323, mobile: 9877767654, services: 'Jaime', product: 45, provider: 'SRK', quantity: 43, amount: 1323, created: '12-04-2024', status: 'pending' },
    { id: 4, transaction_id: 1239, mobile: 9876543234, services: 'Arya', product: 16, provider: 'KSM', quantity: 46, amount: 9098, created: '12-04-2024', status: 'pending' },
    { id: 5, transaction_id: 9675, mobile: 7564565434, services: 'Daenerys', product: 40, provider: 'KSH', quantity: 98, amount: 1234, created: '12-04-2024', status: 'pending' },
    { id: 6, transaction_id: 1234, mobile: 9875645465, services: 'Kash', product: 150, provider: 'PKP', quantity: 10, amount: 8756, created: '12-04-2024', status: 'pending' },
    { id: 7, transaction_id: 9876, mobile: 8875645363, services: 'Ferrara', product: 44, provider: 'KSP', quantity: 23, amount: 8746, created: '12-04-2024', status: 'pending' },
    { id: 8, transaction_id: 2344, mobile: 8777878898, services: 'Rossini', product: 36, provider: 'KKR', quantity: 32, amount: 8576, created: '12-04-2024', status: 'pending' },
    { id: 9, transaction_id: 8655, mobile: 9877767677, services: 'Harvey', product: 65, provider: 'RCB', quantity: 25, amount: 8877, created: '12-04-2024', status: 'pending' },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function BrandsTable() {
    return (
        <Paper sx={{ height: 'auto', width: '100%', padding: "20px", paddingBottom: "30px" }}>
            <h1 className='text-gray-700 font-semibold'>Recent Transactions</h1>
            <hr className='text-gray-800 mt-2'></hr>
            <DataGrid
                rows={rows}
                columns={columns}
                sx={{
                    // this css for value
                    border: 0,
                    color: '#616161',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#616161',
                        color: '#ffffff',
                    },
                    // this css for header titles
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontSize: '14px',  // You can set font size here
                        // textTransform: 'uppercase', // Optional: Capitalize the header titles
                        color: '#616161',
                        fontWeight: "bold",
                    },
                }}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 25]}
            />

        </Paper>
    );
}











