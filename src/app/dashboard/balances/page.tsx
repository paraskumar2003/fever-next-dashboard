
'use client'
import React, { useState, useEffect } from 'react';
import TableComponent from '@/components/shared/dataGrid';
import { RdIcon } from '@/components/shared/icons';
import { GridColDef } from '@mui/x-data-grid';
import CommonButton from '@/components/Common/button';
import Api from '@/services/api'
import BreadCrumb from '@/components/Common/breadCrumb';
import { Button } from '@/components/ui/button';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


interface Vendor {
    id: number;
    service_provider: string;
    name: string;
    check_balance: string;
    updated_balance: string;
    createdAt: string;
    updatedAt: string;
}

const GetAllBalance = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState(false);
    const router = useRouter()

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "service_provider", headerName: "Providers", width: 200 },
        { field: "name", headerName: "Service Type", width: 250 },
        {
            field: "check_balance",
            headerName: "Check Balance",
            width: 150,
            renderCell: (params) => (
                <CommonButton className='mt-[6px]' symbolIcon={<RdIcon iconName='refresh' iconclasses={["text-white", "text-[32px]"]}
                />} buttonText='Balance' onClick={() => handleCheckBalance(params.row.id)}></CommonButton>
            ),
        },
        { field: "updated_balance", headerName: "Updated Balance", width: 250 },

        {
            field: "product", headerName: "Product", width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const { row } = params; // Access the entire row data
                const isCouponCard = row.name === "coupon_card";

                return (
                    <div className="flex items-center ">
                        {/* Conditionally show the export button */}
                        {isCouponCard && (
                            <Button onClick={() => handleExportCouponCard()}
                                className=" bg-orange-600  mt-[10px]" size={'export'} disabled={isExporting}
                            >
                                {isExporting ? <RdIcon iconName='download' iconclasses={["text-white text-[10px]"]} /> : <RdIcon iconName='download' iconclasses={["text-white text-[10px]"]} />}

                            </Button>

                        )}
                    </div>
                );
            },
        },

        { field: "createdAt", headerName: "Created At", width: 150 },
        { field: "updatedAt", headerName: "Updated At", width: 150 },
    ];

    const getServices = async () => {
        setLoading(true);
        try {
            const { formattedProvider, totaCount } = await Api.Providers.getAllProviders(page, size);
            setVendors(formattedProvider);
            setPagination(totaCount);
            console.log(totaCount, "TOTAL_COUNT")
            setLoading(false);
            console.log("FORMATE VENDORS", formattedProvider,)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getServices();
    }, [page, size]);



    const handleCheckBalance = async (id: number) => {
        const balance = await Api.Providers.getCheckBalance(id, vendors);
        if (balance !== null) {
            // Update the updated_balance column for the specific provider with updated balance 
            setVendors((prev) =>
                prev.map((dt) =>
                    dt.id === id
                        ? { ...dt, updated_balance: balance }
                        : dt
                )
            );
        }
    };

    const handleExportCouponCard = async () => {
        try {
            console.log("ENTER IN THE FUNCTION");
            setIsExporting(true); // Disable button when clicked

            // Call the utility function to get the blob
            const blob = await Api.Providers.exportTransactions("approved");

            // Trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Product-List.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting data:", error);
        } finally {
            setIsExporting(false); // Enable button after response
        }
    };

    const handleBack = async () => {
        router.push('/dashboard')
    }
    return (
        <>
            <BreadCrumb name='Providers' buttonText='Back' onClick={handleBack} ></BreadCrumb>

            <TableComponent<Vendor>
                rows={vendors}
                columns={columns}
                rowCount={pagination}
                page={page}
                pageSize={size}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setSize(newSize)}
                loading={loading}
            />
        </>
    );
};

export default GetAllBalance;
