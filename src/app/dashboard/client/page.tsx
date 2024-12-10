'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation'
import Notiflix from 'notiflix';
import BreadCrumb from '@/components/Common/breadCrumb';
import TableComponent from '@/components/shared/dataGrid';
import Api from "@/services/api";

interface Vendor {
    id: number;
    business_contact_number: string;
    contact_person_name: string;
    email: string;
    organization_name: string;
    organization_pan_number: string;
    phone_number: string;
    technical_contact_number: string;
    website_link: string;
    createdAt: string;
    updatedAt: string;
}

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "contact_person_name", headerName: "Name" },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone_number", headerName: "Phone Number", width: 150 },
    { field: "business_contact_number", headerName: "Business Contact", width: 150 },
    { field: "technical_contact_number", headerName: "Technical Contact", width: 150 },
    { field: "organization_name", headerName: "Organization Name", width: 200 },
    { field: "organization_pan_number", headerName: "Organization PAN", width: 200 },
    { field: "website_link", headerName: "Website Link", width: 250 },
    { field: "createdAt", headerName: "Created At", width: 250 },
    { field: "updatedAt", headerName: "Updated At", width: 250 },
];

const GetAllVendors = () => {
    const Loader_Color = 'rgba(241,230,230,0.985)'

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [pagination, setPagination] = useState<number>(0);
    console.log(pagination, "paggg")
    const router = useRouter()

    // Re-fetch vendors when page or size changes
    const getVendors = async () => {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        Notiflix.Loading.standard(); // Show loader  
        try {

            console.log(333, 'Enter in GetVendor Function')
            const { formattedVendors, totaCount } = await Api.Vendors.getAllVendors(page, size);
            Notiflix.Loading.remove();
            setVendors(formattedVendors);
            setPagination(totaCount);
            setLoading(false);
            console.log("FORMATE VENDORS", formattedVendors,)
        } catch (error) {
            Notiflix.Loading.remove();
            console.log(99898, error)
            setLoading(false);
        } finally {
            Notiflix.Loading.remove();
        }
    };
    const handleToAddNewClient = () => {
        Notiflix.Loading.init({ svgColor: Loader_Color })
        Notiflix.Loading.standard(); // Show loader  
        router.push("/dashboard/client/add");
        Notiflix.Loading.remove()
    };
    useEffect(() => {
        getVendors();
    }, [page, size]);

    return (
        <>
            <BreadCrumb name='Clients' buttonText='Add' symbolIcon='+' onClick={handleToAddNewClient}></BreadCrumb>
            <TableComponent
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

export default GetAllVendors;









