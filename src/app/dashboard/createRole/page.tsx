'use client'
import React from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import apiClient from '@/services/apiClient'

const CreateRole = () => {
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            roleName: '',
        },
        validationSchema: Yup.object({
            roleName: Yup.string()
                .required('Role name is required')
                .min(3, 'Role name must be at least 3 characters'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await apiClient.post(`/gratification/create-role`, { role: values.roleName })
                if (response?.data?.statusCode === 200) {
                    alert('Role created successfully!')
                    router.push('/dashboard')
                    resetForm()
                } else if (response?.data?.statusCode === 409) {
                    alert(response.data.message)
                } else {
                    alert('Failed to create role. Please try again.')
                }
            } catch (error) {
                console.error('Error occurred:', error)
                // alert(error?.response?.data?.message || 'An unexpected error occurred.')
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <div className="flex items-center justify-center pt-20 ">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
            >
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Role Registration
                </h1>
                <div className="mb-6">
                    <label
                        htmlFor="roleName"
                        className="block text-sm font-medium text-gray-600 mb-2"
                    >
                        Role Name
                    </label>
                    <input
                        id="roleName"
                        name="roleName"
                        type="text"
                        placeholder="Enter Role Name"
                        className={`w-full px-4 py-2 text-sm border rounded-md focus:ring-2 focus:outline-none ${formik.errors.roleName && formik.touched.roleName
                            ? 'border-red-500 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-orange-400'
                            }`}
                        value={formik.values.roleName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.roleName && formik.touched.roleName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.roleName}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </div>
    )
}

export default CreateRole
