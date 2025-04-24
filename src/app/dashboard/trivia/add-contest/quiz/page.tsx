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
  question: string;
  options_1: string;
  options_2: string;
  options_3: string;
  options_4: string;
  answer: string;
};

const Client_Registration = () => {
  const router = useRouter();
  // const { registerVendor } = useVendorRegistration();  // Using the custom hook
  const isSubmitting = false;
  const submitButtonName = "SUBMIT";
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([
    {
      question: "",
      options_1: "",
      options_2: "",
      options_3: "",
      options_4: "",
      answer: "",
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
    router.push("/dashboard/trivia");
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
          question: "",
          options_1: "",
          options_2: "",
          options_3: "",
          options_4: "",
          answer: "",
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

  // const handleInputChange = (
  //   index: number,
  //   field: keyof DynamicField,
  //   value: string
  // ) => {
  //   const updatedFields = [...dynamicFields];
  //   updatedFields[index][field] = value; // Safe access
  //   setDynamicFields(updatedFields);
  // };

  const handleToBack = () => {
    router.push("/dashboard/trivia");
  };

  return (
    <>
      <BreadCrumb
        name="Add Contest"
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
              Quiz Questions
            </h3>
            {dynamicFields.map((field, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 md:grid-cols-[6fr_6fr_auto] items-center"
              >
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`question-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Question
                  </label>
                  <Field
                    id={`question-${index}`}
                    name={`dynamicFields[${index}].question`}
                    type="text"
                    placeholder="Question"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`text_color-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Option 1
                  </label>
                  <Field
                    id={`option1-${index}`}
                    name={`dynamicFields[${index}].option1`}
                    type="text"
                    placeholder="Option 1"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`gradient_colors-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Option 2
                  </label>
                  <Field
                    id={`option2-${index}`}
                    name={`dynamicFields[${index}].option2`}
                    type="text"
                    placeholder="Option 2"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`background_colors-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Option 3
                  </label>
                  <Field
                    id={`option3-${index}`}
                    name={`dynamicFields[${index}].option3`}
                    type="text"
                    placeholder="Option 3"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`option4-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Option 4
                  </label>
                  <Field
                    id={`option4-${index}`}
                    name={`dynamicFields[${index}].option4`}
                    type="text"
                    placeholder="Option 4"
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col md:col-span-1">
                  <label
                    htmlFor={`answer-${index}`}
                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                  >
                    Answer
                  </label>
                  <Field
                    as="select"
                    id={"answer"}
                    name={"answer"}
                    className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                  >
                    <option value="">Select an option</option>

                    <option key="option1" value="Option 1">
                      Option 1
                    </option>
                    <option key="option2" value="Option 2">
                      Option 2
                    </option>
                    <option key="option3" value="Option 3">
                      Option 3
                    </option>
                    <option key="option4" value="Option 4">
                      Option 4
                    </option>
                  </Field>
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
