'use client'
import axios from 'axios';
import { getToken } from '@/lib/utils';
import Notiflix from 'notiflix';

let isNotiflixInitialized = false; //define for notiflix


// Base configuration
const Loader_Color = 'rgba(241,230,230,0.985)';

// Notiflix.Loading.init({ svgColor: Loader_Color });
if (typeof window !== 'undefined') {
    if (!isNotiflixInitialized) {
        Notiflix.Loading.init({ svgColor: Loader_Color });
        isNotiflixInitialized = true;
    }
}


const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://trapi.vouch.club', // Set your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Notiflix.Loading.standard() // show loader --
        if (typeof window !== 'undefined') {
            Notiflix.Loading.standard(); // Show loader
        }
        // Add Authorization header or other custom headers
        const token = getToken(); // Replace with your token retrieval logic
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;

    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Notiflix.Loading.remove()
        if (typeof window !== 'undefined') {
            Notiflix.Loading.remove();
        }

        // Process and return response data
        return response.data;

    },
    (error) => {
        // Notiflix.Loading.remove()
        if (typeof window !== 'undefined') {
            Notiflix.Loading.remove();
        }
        // Handle response errors
        if (error.response?.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            console.error('Unauthorized access - please log in again.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;







