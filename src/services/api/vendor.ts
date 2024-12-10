
import apiClient from "@/services/apiClient";

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

export const getAllVendors = async (page: number, size: number) => {
    const res = await apiClient.get(`/gratification/get-all-vendors?page=${page}&size=${size}`);
    const { data: { data: vendorsData, totaCount } } = res;

    const formattedVendors = vendorsData.map((vendor: Vendor, i: number) => ({
        id: (page - 1) * size + i + 1,
        business_contact_number: vendor.business_contact_number,
        contact_person_name: vendor.contact_person_name,
        email: vendor.email,
        organization_name: vendor.organization_name,
        organization_pan_number: vendor.organization_pan_number,
        phone_number: vendor.phone_number,
        technical_contact_number: vendor.technical_contact_number,
        website_link: vendor.website_link,
        // createdAt: new Date(vendor.createdAt).toLocaleString("en-IN"),
        // updatedAt: new Date(vendor.updatedAt).toLocaleString("en-IN"),
        createdAt: new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(vendor.createdAt)),
        updatedAt: new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(vendor.updatedAt)),
    }));

    return { formattedVendors, totaCount };
};
