"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Notiflix from "notiflix";
import Api from "@/services/api";
import TableComponent from "@/components/shared/dataGrid";
import CommonButton from "@/components/Common/button";

interface Vendor {
    id: number;
    credits: string;
    service_type: string;
    merchant_account: string;
    type: string;
    msisdn: string;
    status: string;
    transaction_id: string;
    organization_name: string;
    vault_balance: string;
    vendor_id: string;
    vendor_transaction_id: string;
    createdAt: string;
    updatedAt: string;
}
interface VendorData {
    credits: string;
    service_type: string;
    vendorData?: { organization_name: string };
    type: string;
    status: string;
    transaction_id: string;
    vault_balance: string;
    vendor_id: string;
    msisdn: string;
    vendor_transaction_id: string;
    createdAt: string;
    updatedAt: string;
}

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "credits", headerName: "Amount", width: 200 },
    { field: "service_type", headerName: "service type", width: 250 },
    { field: "merchant_account", headerName: "Merchant Account", width: 250 },
    { field: "msisdn", headerName: "msisdn", width: 150 },
    { field: "type", headerName: "type", width: 150 },
    { field: "status", headerName: "status", width: 150 },
    { field: "transaction_id", headerName: "transaction id", width: 250 },
    { field: "organization_name", headerName: "Organization Name", width: 250 },
    { field: "vault_balance", headerName: "wallet balance", width: 250 },
    { field: "vendor_id", headerName: "vendor id", width: 250 },
    {
        field: "vendor_transaction_id",
        headerName: "vendor transaction id",
        width: 250,
    },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 },
];

const GetAllTransactions = () => {
    const Loader_Color = "rgba(241,230,230,0.985)";

    // Notiflix.Loading.init({ svgColor: Loader_Color }); // Initialize loader configuration
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [isExporting, setIsExporting] = useState(false); // State to manage xport button disabled

    const getTransactions = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader
        try {
            console.log(1111, "Enter in the Function");
            const res = await Api.Transactions.getAllTransactions({
                page,
                size,
                status: filterStatus,
            });
            Notiflix.Loading.remove();
            console.log(44444, res);
            console.log("Data", res.data.data);
            console.log("Count_Data", res.data.totaCount);
            if (res.data.success) {
                Notiflix.Loading.remove();
            }
            const {
                data: { data: vendorsData, totaCount: totalCount },
            } = res;

            // console.log(6666, vendorsData)
            console.log(77777, totalCount);
            const result: Vendor[] = [];
            vendorsData?.map((dt: VendorData, i: number) => {
                let updatedServiceType;
                switch (true) {
                    case dt?.service_type?.toUpperCase().startsWith("QC"):
                        updatedServiceType = "Quicksilver";
                        break;
                    case dt?.service_type?.toLowerCase() === "vouchers":
                        updatedServiceType = "Almonds Vouchers";
                        break;
                    default:
                        updatedServiceType = dt?.service_type;
                }

                result.push({
                    id: (page - 1) * size + i + 1,
                    credits: dt?.credits,
                    merchant_account: updatedServiceType,
                    service_type: updatedServiceType,
                    organization_name: dt?.vendorData?.organization_name || "", // Provide a default empty string
                    type: dt?.type,
                    status: dt?.status,
                    transaction_id: dt?.transaction_id,
                    vault_balance: dt.vault_balance,
                    vendor_id: dt?.vendor_id,
                    msisdn: dt?.msisdn,
                    vendor_transaction_id: dt?.vendor_transaction_id,
                    // createdAt: new Date(dt.createdAt).toLocaleString("en-IN"),
                    // updatedAt: new Date(dt.updatedAt).toLocaleString("en-IN"),
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
            console.log(55555);
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

    const handleExport = async () => {
        console.log(989898);
        try {
            console.log("ENTER IN THE FUNCTION");
            setIsExporting(true); // Disable button when clicked
            const response = await Api.Transactions.exportTransactions({
                status: "approved",
            });

            // Check if data is available
            const { data } = response;
            if (!data || !data.data) {
                console.error("No data received for export.");
                return;
            }

            // Convert JSON data to Excel
            const xlsx = await import("xlsx"); // Dynamically import xlsx to ensure it works properly with Next.js
            const worksheet = xlsx.utils.json_to_sheet(data.data); // Convert JSON to sheet
            const workbook = xlsx.utils.book_new(); // Create a new workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions"); // Append the sheet to the workbook

            // Create a blob from the workbook
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const blob = new Blob([excelBuffer], {
                type: "application/octet-stream",
            });

            // Create a download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Transaction-List.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
        } finally {
            setIsExporting(false); // Enable button after response
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
    };
    useEffect(() => {
        Notiflix.Loading.init({ svgColor: Loader_Color }); // Initialize loader configuration
        getTransactions();
    }, [page, size, filterStatus]);

    return (
        <>
            <span className="transaction-header">
                <h1 className="transaction-title sm:text-sm md:text-md lg:text-lg">
                    Transactions
                </h1>
                <div className="flex items-center space-x-2">
                    <select
                        value={filterStatus}
                        onChange={handleStatusChange}
                        className="border h-[34px] rounded-sm focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700"
                    >
                        <option value="">Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                    </select>

                    {/* Export Button */}
                    <CommonButton onClick={() => handleExport()}
                        className={`export-button  ${isExporting ? "export-button-disabled" : "export-button-active"
                            }`}
                        disabled={isExporting}
                        buttonText={isExporting ? "Exporting..." : "Export List"}
                    >
                    </CommonButton>
                </div>
            </span>
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

export default GetAllTransactions;
