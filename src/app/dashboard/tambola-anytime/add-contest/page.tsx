'use client'
import React from "react";
import DynamicForm from "@/components/shared/form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
import useVendorRegistration from '@/components/apiServices/vendorService';  // Import the custom hook
import { getToken } from "@/lib/utils";
import BreadCrumb from "@/components/Common/breadCrumb";

const Client_Registration = () => {
    const router = useRouter();
    const { registerVendor } = useVendorRegistration();  // Using the custom hook

    const formFields = [
        {
            "name": "name",
            "label": "Contest Name",
            "type": "text",
            "placeholder": "Enter Contest Name",
            "validation": Yup.string().trim().matches(/^[^0-9]*$/, 'Name cannot contain Numbers').required('Name is required')
        },
        {
            "name": "rewards",
            "label": "Reward Name",
            "type": "text",
            "placeholder": "Enter Rewards",
            "validation": Yup.string().required('Rewards are required')
        },
        {
            "name": "startDate",
            "label": "Start Date",
            "type": "date",
            "placeholder": "Select Start Date",
            "validation": Yup.date().required('Start Date is required')
        },
        {
            "name": "endDate",
            "label": "End Date",
            "type": "date",
            "placeholder": "Select End Date",
            "validation": Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End Date cannot be before Start Date')
        },
        {
            "name": "contestType",
            "label": "Contest Type",
            "type": "select",
            "placeholder": "Enter Contest Type",
            "selectOptions":[{ value: "FREE", label: "FREE" },{ value: "PIAD", label: "PIAD" }],
            "validation": Yup.string().required('Contest Type is required')
        },
        {
            "name": "contestFee",
            "label": "Contest Fee",
            "type": "number",
            "placeholder": "Enter Contest Fee",
            "validation": Yup.number().required('Contest Fee is required').positive('Fee must be positive')
        },
        {
            "name": "contestTypeName",
            "label": "Contest Type Name",
            "type": "select",
            "placeholder": "Enter Contest Type Name",
            "selectOptions":[{ value: "MAHA_BONANZA", label: "MAHA BONANZA" },{ value: "REGULAR", label: "REGULAR" }],
            "validation": Yup.string().required('Contest Type Name is required'),
            
        },
        {
            "name": "sponsored_name",
            "label": "Sponsor Name",
            "type": "text",
            "placeholder": "Enter Sponsor Name",
            "validation": Yup.string().trim().required('Sponsor Name is required')
        },
        {
            "name": "sponsored_logo",
            "label": "Sponsor Logo",
            "type": "file",
            "placeholder": "Upload Sponsor Logo",
            "validation": Yup.mixed().required('Sponsor Logo is required')
        },
        {
            "name": "thumbnail",
            "label": "Thumbnail",
            "type": "file",
            "placeholder": "Upload Thumbnail",
            "validation": Yup.mixed().required('Thumbnail is required')
        },
        {
            "name": "contestImage",
            "label": "Contest Image",
            "type": "file",
            "placeholder": "Upload Contest Image",
            "validation": Yup.mixed().required('Contest Image is required')
        },

        // Add more fields as needed
    ];

    const initialValues = {
        email: "",
        password: "",
        contact_person_name: '',
        website_link: '',
        technical_contact_number: '',
        organization_pan_number: '',
        phone_number: '',
        organization_name: '',
        business_contact_number: '',
    };

    const handleSubmit = (values: Record<string, string>) => {
        const requestData = {
            contact_person_name: values.contact_person_name,
            organization_name: values.organization_name,
            organization_pan_number: values.organization_pan_number,
            website_link: values.website_link,
            phone_number: values.phone_number ? values.phone_number.toString() : "",
            technical_contact_number: values.technical_contact_number ? values.technical_contact_number.toString() : "",
            business_contact_number: values.business_contact_number ? values.business_contact_number.toString() : "",
            email: values.email,
            password: values.password,
        };

        // Call the registerVendor function from the custom hook
        const token = getToken();
        if (token) {
            //registerVendor(requestData); // Pass request data and token to the service
        }
    };

    const handleToBack = () => {
        router.push("/dashboard/tambola-anytime");
    };

    return (
        <>
            <BreadCrumb name='Tamboal Anytime Add' buttonText='Back' symbolIcon={<RdIcon iconName="backPage" />} onClick={handleToBack}></BreadCrumb>
            <DynamicForm fields={formFields} initialValues={initialValues} onSubmit={handleSubmit} />
        </>
    );
};

export default Client_Registration;
