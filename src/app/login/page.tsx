'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import images from "../../utils/constants/images";
import { Button } from '@/components/ui/button'
import { RdIcon } from '@/components/shared/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Notiflix from 'notiflix';
// import API from "../../services/api";
import axios from 'axios';

// Define the structure of the login response
interface LoginResponse {
    status: boolean;
    message: string;
    data: {
        token: string;
        payload: {
            role: string;
        };
    };
}


export default function Login() {

    const Loader_Color = 'rgba(241,230,230,0.985)'
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                Notiflix.Loading.init({ svgColor: Loader_Color });
                //const response = await axios.post(`${process.env.baseUrl}/auth/login`, values);
                // const response = await API.AuthAPI.login(values); // Call API from auth.ts
                // const response = await axios.post(`https://trapi.vouch.club/auth/login`, values)
               // const loginResponse = response.data as LoginResponse;

               const loginResponse = {
                status: true,
                message: "Successfull Login",
                data: {
                    token: "4353534534",
                    payload: {
                        role: "super_admin"
                    }
                }
               }
                // console.log("Login successful:", response);
                if (loginResponse.status === true) {
                    Notiflix.Loading.remove();
                    Swal.fire({
                        title: '',
                        text: (loginResponse?.message),
                        icon: 'success',
                        confirmButtonColor: '#333333',
                    });
                    // Store token and role directly as strings
                    const { token, payload: { role } } = loginResponse.data;
                    localStorage.setItem("accessToken", JSON.stringify(token));
                    localStorage.setItem("role", JSON.stringify(role));
                    localStorage.setItem("data", JSON.stringify(loginResponse.data)); // Convert object to string
                    Cookies.set("accessToken", token);
                    Cookies.set("role", role);
                    Cookies.set("data", JSON.stringify(loginResponse.data)); // Convert object to string for Cookies
                    router.push("/dashboard")
                } else {
                    Notiflix.Loading.remove();
                    Swal.fire({
                        title: 'error',
                        text: (loginResponse?.message),
                        icon: 'error',
                        confirmButtonColor: '#333333',
                    });
                }
            } catch (error) {
                console.error("Login failed:", error);
                Notiflix.Loading.remove();
                console.error("Login failed:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#333333',
                });
            }
        },
    });

    return (
        <>
            <div
                className="flex flex-col md:flex-row lg:flex-row lg:justify-between h-screen p-5 md:p-0 lg:p-0 overflow-hidden   bg-gradient-to-b from-[#11025a] to-[#0a003b]"
            >
                {/* Left section for the image */}
                <div className="relative sm:w-full lg:w-[50%] h-[50%] md:h-screen lg:h-screen">
                    <div className="absolute inset-0 flex items-center justify-center z-10 p-8 lg:p-16">
                        <Image
                            src={images.loginLogo}
                            alt="logo"
                            width={200}
                            height={200}
                            className="mb-4 lg:mb-10"
                        />
                    </div>
                </div>

                {/* Right section for the login form */}
                <div className="w-full lg:w-[50%] h-[500px] md:h-screen lg:h-screen flex flex-col justify-center p-4 lg:p-5 rounded-md  bg-white">
                    <div className="flex flex-col justify-center self-center w-full sm:w-[85%] md:w-[80%] lg:w-[60%] gap-1">
                        <span className="text-[20px]  lg:text-[30px] font-extralight">Proceed With your</span>
                        <span className="text-[24px]  lg:text-[26px] font-semibold">Login</span>
                        <form onSubmit={formik.handleSubmit} className="w-full">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`p-2 mt-2 rounded-md border-2 w-full h-12 lg:h-11 mb-2 focus:border-[#062f62] focus:outline-none `}
                                placeholder="Enter Email Id"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            ) : null}

                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="p-2 mt-2 rounded-md border-2 w-full h-12 lg:h-11 mb-2 focus:border-[#062f62] focus:outline-none"
                                    placeholder="Enter Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0.5 flex items-center cursor-pointer text-red-800 pr-2"
                                >
                                    {showPassword ? <RdIcon iconName="open-eye" iconclasses={["text-orange-700", "text-[24px]"]}
                                    /> : <RdIcon iconName="eye-off" iconclasses={["text-orange-700 ", "text-[24px]"]}
                                    />}
                                </span>
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <Button
                                type='submit'
                                // buttonName="Login"
                                dynamicSize="h-12 px-8"
                                onClick={() => console.log("Button clicked")}
                                maxLength={10}
                                color="white"
                                className='bg-gradient-to-b from-[#f800fc] to-[#c900cc] text-2xl w-full'
                                variant="outline"
                                size="lg"
                            >Login</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
