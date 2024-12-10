'use client'
import { useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';

// Method - 2 for Api Integration Particularly

// The API call and logic to handle vendor registration
const registerVendorService = async (requestData: Record<string, string>, token: string) => {
    try {
        // Make the API request
        const response = await axios.post<{ data: { vendor_id: string }; message: string }>(
            `${process.env.baseUrl}/gratification/create-vendors`,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token as Authorization header..
                },
            }
        );

        // If response is successful, save vendor_id and return the vendor ID
        const vendorId = response.data.data.vendor_id;
        localStorage.setItem('vendor_id', vendorId);
        Notiflix.Loading.remove();
        // Return success response
        return { success: true, message: response.data.message };

        // Different type of errors we can receive [Catch Errors]
    } catch (error: unknown) {
        let errorMessage = 'An unknown error occurred. Please try again.';
        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
        }

        Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#333333',
        }).then(() => {
            window.location.reload();
        });

        return { success: false, message: errorMessage }; // Return failure structure..!
    } finally {
        Notiflix.Loading.remove();
    }
};

// Custom hook for vendor registration..!
const useVendorRegistration = () => {
    const router = useRouter();

    const register = useCallback(async (requestData: Record<string, string>) => {
        const token = getToken();
        if (!token) {
            // Handle case where token is missing..!
            Swal.fire({
                title: 'Error',
                text: 'Authentication token is missing.',
                icon: 'error',
            });
            return;
        }

        // Call the API service
        const result = await registerVendorService(requestData, token);

        if (result.success) {
            // Success notification..!
            Swal.fire({
                title: 'Success',
                text: result.message,
                icon: 'success',
            });

            router.push('/dashboard/client');
            Notiflix.Loading.remove();
        } else {
            // Error notification..!
            Swal.fire({
                title: 'Error',
                text: result.message,
                icon: 'error',
            });
        }
    }, [router]);

    return { registerVendor: register }; // Return the register function to use in our components for api integration..!
};

export default useVendorRegistration;
