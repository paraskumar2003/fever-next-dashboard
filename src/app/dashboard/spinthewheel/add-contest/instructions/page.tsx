"use client";
import React, { useState } from "react";
// import DynamicForm from "@/components/shared/form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
// import useVendorRegistration from '@/components/apiServices/vendorService';  // Import the custom hook
// import { getToken } from "@/lib/utils";
import BreadCrumb from "@/components/Common/breadCrumb";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";

type DynamicField = { title: string; description: string };

const Client_Registration = () => {
  const router = useRouter();
  // const { registerVendor } = useVendorRegistration();  // Using the custom hook
  const isSubmitting = false;
  const submitButtonName = "NEXT";
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([
    { title: "", description: "" },
  ]);

  //   const formFields = [
  //     {
  //       name: "name",
  //       label: "Contest Name",
  //       type: "text",
  //       placeholder: "Enter Contest Name",
  //       validation: Yup.string()
  //         .trim()
  //         .matches(/^[^0-9]*$/, "Name cannot contain Numbers")
  //         .required("Name is required"),
  //     },
  //     {
  //       name: "rewards",
  //       label: "Reward Name",
  //       type: "text",
  //       placeholder: "Enter Rewards",
  //       validation: Yup.string().required("Rewards are required"),
  //     },
  //     {
  //       name: "startDate",
  //       label: "Start Date",
  //       type: "date",
  //       placeholder: "Select Start Date",
  //       validation: Yup.date().required("Start Date is required"),
  //     },
  //     {
  //       name: "endDate",
  //       label: "End Date",
  //       type: "date",
  //       placeholder: "Select End Date",
  //       validation: Yup.date()
  //         .required("End Date is required")
  //         .min(Yup.ref("startDate"), "End Date cannot be before Start Date"),
  //     },
  //     {
  //       name: "contestType",
  //       label: "Contest Type",
  //       type: "select",
  //       placeholder: "Enter Contest Type",
  //       selectOptions: [
  //         { value: "FREE", label: "FREE" },
  //         { value: "PIAD", label: "PIAD" },
  //       ],
  //       validation: Yup.string().required("Contest Type is required"),
  //     },
  //     {
  //       name: "contestFee",
  //       label: "Contest Fee",
  //       type: "number",
  //       placeholder: "Enter Contest Fee",
  //       validation: Yup.number()
  //         .required("Contest Fee is required")
  //         .positive("Fee must be positive"),
  //     },
  //     {
  //       name: "contestTypeName",
  //       label: "Contest Type Name",
  //       type: "select",
  //       placeholder: "Enter Contest Type Name",
  //       selectOptions: [
  //         { value: "MAHA_BONANZA", label: "MAHA BONANZA" },
  //         { value: "REGULAR", label: "REGULAR" },
  //       ],
  //       validation: Yup.string().required("Contest Type Name is required"),
  //     },
  //     {
  //       name: "sponsored_name",
  //       label: "Sponsor Name",
  //       type: "text",
  //       placeholder: "Enter Sponsor Name",
  //       validation: Yup.string().trim().required("Sponsor Name is required"),
  //     },
  //     {
  //       name: "sponsored_logo",
  //       label: "Sponsor Logo",
  //       type: "file",
  //       placeholder: "Upload Sponsor Logo",
  //       validation: Yup.mixed().required("Sponsor Logo is required"),
  //     },
  //     {
  //       name: "thumbnail",
  //       label: "Thumbnail",
  //       type: "file",
  //       placeholder: "Upload Thumbnail",
  //       validation: Yup.mixed().required("Thumbnail is required"),
  //     },
  //     {
  //       name: "contestImage",
  //       label: "Contest Image",
  //       type: "file",
  //       placeholder: "Upload Contest Image",
  //       validation: Yup.mixed().required("Contest Image is required"),
  //     },

  //     // Add more fields as needed
  //   ];

  const initialValues = {
    email: "",
    password: "",
    contact_person_name: "",
    website_link: "",
    technical_contact_number: "",
    organization_pan_number: "",
    phone_number: "",
    organization_name: "",
    business_contact_number: "",
  };

  const handleSubmit = (values: Record<string, string>) => {
    console.log(values);
    router.push("wheel-prize");
    // const requestData = {
    //     contact_person_name: values.contact_person_name,
    //     organization_name: values.organization_name,
    //     organization_pan_number: values.organization_pan_number,
    //     website_link: values.website_link,
    //     phone_number: values.phone_number ? values.phone_number.toString() : "",
    //     technical_contact_number: values.technical_contact_number ? values.technical_contact_number.toString() : "",
    //     business_contact_number: values.business_contact_number ? values.business_contact_number.toString() : "",
    //     email: values.email,
    //     password: values.password,
    // };

    // Call the registerVendor function from the custom hook
    // const token = getToken();
    // if (token) {
    //     //registerVendor(requestData); // Pass request data and token to the service
    // }
  };

  const handleAddMore = () => {
    if (dynamicFields.length < 7) {
      setDynamicFields([...dynamicFields, { title: "", description: "" }]);
    }
  };

  const handleRemoveField = (index: number) => {
    if (dynamicFields.length > 1) {
      const updatedFields = [...dynamicFields];
      updatedFields.splice(index, 1);
      setDynamicFields(updatedFields);
    }
  };

  //   const handleInputChange = (
  //     index: number,
  //     field: keyof DynamicField,
  //     value: string
  //   ) => {
  //     const updatedFields = [...dynamicFields];
  //     updatedFields[index][field] = value; // Safe access
  //     setDynamicFields(updatedFields);
  //   };

  const handleToBack = () => {
    router.push("/dashboard/spinthewheel");
  };

  return (
    <>
      <BreadCrumb
        name="Contest 1"
        buttonText="Back"
        symbolIcon={<RdIcon iconName="backPage" />}
        onClick={handleToBack}
      ></BreadCrumb>
      {/* <DynamicForm fields={formFields} initialValues={initialValues} onSubmit={handleSubmit} /> */}

      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-slate-300 shadow-md lg:max-w-full">
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-lg font-semibold mb-4 col-span-full">
              Instructions
            </h3>
            {dynamicFields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_3fr_auto] items-center"
              >
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`title-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Title
                  </label>
                  <Field
                    id={`title-${index}`}
                    name={`dynamicFields[${index}].title`}
                    type="text"
                    placeholder="Title"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`description-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Description
                  </label>
                  <Field
                    id={`description-${index}`}
                    name={`dynamicFields[${index}].description`}
                    type="text"
                    placeholder="Description"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                {dynamicFields.length > 1 && (
                  <div className="flex justify-center md:justify-start pt-6">
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="bg-red-500 text-white rounded px-4 py-2 h-11"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="col-span-full flex justify-center">
              {dynamicFields.length < 7 && (
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Add More
                </button>
              )}
              <Button
                type="submit"
                className="px-6 py-2 ml-2 text-white w-[20%] bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : submitButtonName}
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default Client_Registration;
