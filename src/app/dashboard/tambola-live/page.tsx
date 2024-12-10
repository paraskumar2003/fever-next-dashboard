"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Notiflix from "notiflix";
import Api from "@/services/api";
import TableComponent from "@/components/shared/dataGrid";
import CommonButton from "@/components/Common/button";
import BreadCrumb from "@/components/Common/breadCrumb";
import { useRouter } from "next/navigation";

interface Vendor {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    thumbnail: string;
    contestType: string;
    contestPayment:string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}
interface VendorData {
    id:number;
    name: string;
    startDate: string;
    endDate: string;
    thumbnail: string;
    contestType:string;
    contestPayment: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 50 },
    { field: "name", headerName: "Contest Name", width: 200 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "contestType", headerName: "Contest Type", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 }
];

const page = () => {
    const Loader_Color = "rgba(241,230,230,0.985)";

    // Notiflix.Loading.init({ svgColor: Loader_Color }); // Initialize loader configuration
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [isExporting, setIsExporting] = useState(false); // State to manage xport button disabled
    const router = useRouter()

    const getTransactions = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader
        try {
            console.log(1111, "Enter in the Function");
            // const res = await Api.Transactions.getAllTransactions({
            //     page,
            //     size,
            //     status: filterStatus,
            // });
            Notiflix.Loading.remove();
            // console.log(44444, res);
            // console.log("Data", res.data.data);
            // console.log("Count_Data", res.data.totaCount);
            // if (res.data.success) {
            //     Notiflix.Loading.remove();
            // }
            const {
                data: { data: vendorsData, totalCount: totalCount },
            } = { data: { data: [{
                id: 1,
                name: "Gold Coin Tambola",
                startDate: "2024-10-10 01:13:20",
                endDate: "2024-10-31 01:13:20",
                thumbnail: "https://fever-v3.s3.ap-south-1.amazonaws.com/games...",
                contestType: "FREE",
                contestPayment: null,
                status: "ACTIVE",
                createdAt: new Date("2024-10-04 08:42:14"),
                updatedAt:  new Date("2024-10-04 08:42:14")
            },
            {
                id: 2,
                name: "Gold Coin Tambola",
                startDate: "2024-10-10 01:13:20",
                endDate: "2024-10-31 01:13:20",
                thumbnail: "https://fever-v3.s3.ap-south-1.amazonaws.com/games...",
                contestType: "PAID",
                contestPayment: null,
                status: "ACTIVE",
                createdAt: new Date("2024-10-04 08:42:14"),
                updatedAt:  new Date("2024-10-04 08:42:14")
            }], totalCount: 1 } };

            // console.log(6666, vendorsData)
            console.log(77777, totalCount);
            const result: Vendor[] = [];
            vendorsData?.map((dt: VendorData, i: number) => {
                result.push({
                    id: (page - 1) * size + i + 1,
                    name: dt.name,
                    startDate: dt.startDate,
                    endDate: dt.endDate,
                    thumbnail:dt.thumbnail,
                    contestType: dt.contestType,
                    contestPayment: dt.contestPayment,
                    status: dt.status,
                    createdAt: new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    }).format(new Date(dt.createdAt)),
                    updatedAt: new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    }).format(new Date(dt.updatedAt)),
                });
            });
            console.log(result);
            setVendors(result);
            setPagination(totalCount);
            console.log(888888);
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error);
            // console.error("Error fetching vendors:", error.message);
        } finally {
            Notiflix.Loading.remove();
        }
    };

    // const handleExport = async () => {
    //     console.log(989898);
    //     try {
    //         console.log("ENTER IN THE FUNCTION");
    //         setIsExporting(true); // Disable button when clicked
    //         const response = await Api.Transactions.exportTransactions({
    //             status: "approved",
    //         });

    //         // Check if data is available
    //         const { data } = response;
    //         if (!data || !data.data) {
    //             console.error("No data received for export.");
    //             return;
    //         }

    //         // Convert JSON data to Excel
    //         const xlsx = await import("xlsx"); // Dynamically import xlsx to ensure it works properly with Next.js
    //         const worksheet = xlsx.utils.json_to_sheet(data.data); // Convert JSON to sheet
    //         const workbook = xlsx.utils.book_new(); // Create a new workbook
    //         xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions"); // Append the sheet to the workbook

    //         // Create a blob from the workbook
    //         const excelBuffer = xlsx.write(workbook, {
    //             bookType: "xlsx",
    //             type: "array",
    //         });
    //         const blob = new Blob([excelBuffer], {
    //             type: "application/octet-stream",
    //         });

    //         // Create a download link and trigger download
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute("download", "Transaction-List.xlsx");
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //     } catch (error) {
    //         console.error("Error exporting data:", error);
    //     } finally {
    //         setIsExporting(false); // Enable button after response
    //     }
    // };

    // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setFilterStatus(e.target.value);
    // };
    useEffect(() => {
        Notiflix.Loading.init({ svgColor: Loader_Color }); // Initialize loader configuration
        getTransactions();
    }, [page, size, filterStatus]);

    const addContest = async () => {
        router.push('/dashboard/tambola-live/add-contest');
    }

    return (
        <>
             <BreadCrumb name='Tambola Live' buttonText='Add Contest' onClick={addContest} ></BreadCrumb>
            {/* Data Grid */}

            <TableComponent
                rows={vendors}
                columns={columns}
                rowCount={pagination}
                page={page}
                pageSize={size}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setSize(newSize)}
            />
        </>
    );
};

export default page;
