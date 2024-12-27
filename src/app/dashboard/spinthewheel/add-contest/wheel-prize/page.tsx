"use client";
import React, { useState } from "react";
// import DynamicForm from "@/components/shared/form";
// import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { RdIcon } from "@/components/shared/icons";
// import useVendorRegistration from '@/components/apiServices/vendorService';  // Import the custom hook
// import { getToken } from "@/lib/utils";
import BreadCrumb from "@/components/Common/breadCrumb";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";

type DynamicField = {
  prize_name: string;
  text_color: string;
  gradientColors: string;
  backgroundColors: string;
  imageUrl: string;
  qty: string;
  feverbucks: string;
  rewards: string;
  couponType: string;
};

const Client_Registration = () => {
  const router = useRouter();
  // const { registerVendor } = useVendorRegistration();  // Using the custom hook
  const isSubmitting = false;
  const submitButtonName = "NEXT";
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([
    {
      prize_name: "",
      text_color: "",
      gradientColors: "",
      backgroundColors: "",
      imageUrl: "",
      qty: "",
      feverbucks: "",
      rewards: "",
      couponType: "",
    },
  ]);

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
    router.push("quiz");
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
      setDynamicFields([
        ...dynamicFields,
        {
          prize_name: "",
          text_color: "",
          gradientColors: "",
          backgroundColors: "",
          imageUrl: "",
          qty: "",
          feverbucks: "",
          rewards: "",
          couponType: "",
        },
      ]);
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
              Wheel Prizes
            </h3>
            {dynamicFields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 md:grid-cols-[6fr_6fr_auto] items-center"
              >
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`prize_name-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Prize Name
                  </label>
                  <Field
                    id={`prize_name-${index}`}
                    name={`dynamicFields[${index}].prize_name`}
                    type="text"
                    placeholder="Prize Name"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`text_color-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Text Color
                  </label>
                  <Field
                    id={`text_color-${index}`}
                    name={`dynamicFields[${index}].text_color`}
                    type="text"
                    placeholder="Text Color"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`gradient_colors-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Gradient Colors
                  </label>
                  <Field
                    id={`gradient_colors-${index}`}
                    name={`dynamicFields[${index}].gradientColors`}
                    type="text"
                    placeholder="Gradient Colors"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`background_colors-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Background Colors
                  </label>
                  <Field
                    id={`background_colors-${index}`}
                    name={`dynamicFields[${index}].backgroundColors`}
                    type="text"
                    placeholder="Background Colors"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`image_url-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Image
                  </label>
                  <Field
                    id={`image_url-${index}`}
                    name={`dynamicFields[${index}].title`}
                    type="file"
                    placeholder="Image"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`quantity-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Quantity
                  </label>
                  <Field
                    id={`quantity-${index}`}
                    name={`dynamicFields[${index}].quantity`}
                    type="text"
                    placeholder="Quantity"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`feverbucks-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Fever Bucks
                  </label>
                  <Field
                    id={`feverbucks-${index}`}
                    name={`dynamicFields[${index}].feverbucks`}
                    type="text"
                    placeholder="Fever Bucks"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`rewards-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Rewards
                  </label>
                  <Field
                    id={`rewards-${index}`}
                    name={`dynamicFields[${index}].rewards`}
                    type="text"
                    placeholder="Rewards"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`couponType-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Coupon Type
                  </label>
                  <Field
                    id={`couponType-${index}`}
                    name={`dynamicFields[${index}].couponType`}
                    type="text"
                    placeholder="Coupon Type"
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
