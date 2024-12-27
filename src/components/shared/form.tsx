'use client';

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "checkbox" | "textarea" | "select" | string; // Added "select"
    placeholder?: string;
    validation?: Yup.AnySchema;
    selectOptions?: { value: string; label: string }[]; // Added for select options
}

interface DynamicFormProps {
    fields: FormField[];
    submitButtonName?:string;
    initialValues: Record<string, string>;
    onSubmit: (values: Record<string, string>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields,submitButtonName="Submit", initialValues, onSubmit }) => {
    // Build Yup validation schema dynamically
    // const validationSchema = Yup.object(
    //     fields.reduce((schema, field) => {
    //         if (field.validation) {
    //             schema[field.name] = field.validation;
    //         }
    //         return schema;
    //     }, {} as Record<string, Yup.AnySchema>)
    // );

    return (
        <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-slate-300 shadow-md lg:max-w-full">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label
                                    htmlFor={field.name}
                                    className="mb-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
                                >
                                    {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <Field
                                        as="select"
                                        id={field.name}
                                        name={field.name}
                                        className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                                    >
                                        <option value="">Select an option</option>
                                        {field.selectOptions?.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                ) : (
                                    <Field
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="p-3 border-2 rounded-md text-sm h-11 focus:outline-none focus:ring-2 focus:bg-slate-50 focus:ring-orange-500"
                                        as={field.type === "textarea" ? "textarea" : "input"}
                                        maxLength={field.type === "number" ? 10 : undefined}
                                    />
                                )}
                                <ErrorMessage
                                    name={field.name}
                                    component="span"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button
                            type="submit"
                            className="px-6 py-2 text-white w-[50%] bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : submitButtonName}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default DynamicForm;
