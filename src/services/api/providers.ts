
import apiClient from "@/services/apiClient";
import Notiflix from "notiflix";
import * as xlsx from "xlsx"; // Import the xlsx library


interface Providers {
    id: number;
    service_provider: string;
    name: string;
    check_balance: string;
    updated_balance: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllProviders = async (page: number, size: number) => {
    const res = await apiClient.get(`/gratification/get-all-services?page=${page}&size=${size}`);
    console.log("Response111", res?.data?.totaCount)
    const { data: { data: providerData, totaCount } } = res;
    console.log('Response22', { data: { data: providerData, totaCount } })

    const formattedProvider = providerData.map((dt: Providers, i: number) => ({
        id: (page - 1) * size + i + 1,
        service_provider: dt?.service_provider,
        name: dt.name,
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
        check_balance: false,
    }));
    return { formattedProvider, totaCount };

};


export const getCheckBalance = async (id: number, vendors: Providers[]) => {
    Notiflix.Loading.standard();

    const selectedVendor = vendors.find((vendor) => vendor.id === id);
    if (!selectedVendor) {
        Notiflix.Notify.failure("Provider not found!");
        Notiflix.Loading.remove();
        return null;
    }

    const accountType = selectedVendor.service_provider;
    // let accountType;

    // if (selectedVendor.service_provider === 'joyalukkas') {
    //     accountType = 'JOYALUKKAS';
    // } else {
    //     accountType = selectedVendor.service_provider; // Default to provider if not joyalukka , could be more accountType
    // }

    console.log("ACCOUNT_TYPE", accountType);

    try {
        // WE are passing the accountType in payload
        const res = await apiClient.post(`/admin/balance/`, { accountType });
        console.log("RESPONSE CHECK BALANCE", res);

        const { balance } = res.data[0];
        console.log("Balance", balance);

        Notiflix.Notify.success('Balance fetched successfully!');
        return balance;
    } catch (error) {
        console.error('Failed to fetch balance:', error);
        Notiflix.Notify.failure('Failed to fetch balance!');
        return null;
    } finally {
        Notiflix.Loading.remove();
    }
};

// Export Product Function


export const exportTransactions = async (service_provider: string) => {
    try {
        // Call the API to get transactions
        const response = await apiClient.post(`/admin/export`, { service_provider });

        // Check if data is available
        const { data } = response;
        if (!data || !data.data) {
            console.error("No data received for export.");
            throw new Error("No data received for export.");
        }

        // Convert JSON data to Excel
        const worksheet = xlsx.utils.json_to_sheet(data.data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");

        // Create a blob from the workbook
        const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        // Return the blob for download
        return blob;
    } catch (error) {
        console.error("Error exporting transactions:", error);
        throw error;
    }
};





