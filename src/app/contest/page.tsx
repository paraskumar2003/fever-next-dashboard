"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import FormInput from "@/components/FormInput";
import FormSection from "@/components/FormSection";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/Button";
import FormSelect from "@/components/FormSelect";

const OnlyContestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rewards: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    contestType: "FREE",
    contestFee: "0",
    contestTypeName: "",
    sponsored_name: "",
    sponsored_logo: "",
    thumbnail: "",
    contestImage: "",
    sponsored_logo_preview: "",
    thumbnail_preview: "",
    contestImage_preview: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (field: string, base64: string) => {
    // Convert base64 to File object
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const file = new File([ab], `${field}.${mimeString.split("/")[1]}`, {
      type: mimeString,
    });
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      [`${field}_preview`]: base64,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("rewards", formData.rewards);

      // Format dates
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      formPayload.append("startDate", startDateTime.toISOString());
      formPayload.append("endDate", endDateTime.toISOString());

      formPayload.append("contestType", formData.contestType);
      formPayload.append("contestFee", formData.contestFee);
      formPayload.append("contestTypeName", formData.contestTypeName);
      formPayload.append("sponsored_name", formData.sponsored_name);

      // Append files
      if (
        typeof window !== "undefined" &&
        (formData.sponsored_logo as any) instanceof File
      ) {
        formPayload.append("sponsored_logo", formData.sponsored_logo);
      }
      if (
        typeof window !== "undefined" &&
        (formData.thumbnail as any) instanceof File
      ) {
        formPayload.append("thumbnail", formData.thumbnail);
      }
      if (
        typeof window !== "undefined" &&
        (formData.contestImage as any) instanceof File
      ) {
        formPayload.append("contestImage", formData.contestImage);
      }

      const response = await axios.post(
        "https://v3api.countrygame.live/v1/trivia/create-contest",
        formPayload,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6bnVsbCwic3ViIjoiMzUiLCJpYXQiOjE3MjkzNTIwNjF9.A0smZ9tH6-57r5fqEK4vNc-e4tS2pwFuV6MZp5FixA0",
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSuccess(true);
      console.log("Contest created:", response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-500 bg-red-500/20 p-4 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-green-500 bg-green-500/20 p-4 text-green-200">
            Contest created successfully!
          </div>
        )}

        <FormSection title="Contest Details">
          <FormInput
            label="Contest Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter contest name"
            required
          />

          <FormInput
            label="Rewards"
            name="rewards"
            value={formData.rewards}
            onChange={handleInputChange}
            placeholder="Enter rewards"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <FormSelect
            label="Contest Type"
            name="contestType"
            value={formData.contestType}
            onChange={handleInputChange}
            options={[
              { value: "FREE", label: "Free" },
              { value: "PAID", label: "Paid" },
            ]}
          />

          {formData.contestType === "PAID" && (
            <FormInput
              label="Contest Fee"
              name="contestFee"
              type="number"
              min="0"
              value={formData.contestFee}
              onChange={handleInputChange}
              required
            />
          )}

          <FormInput
            label="Contest Type Name"
            name="contestTypeName"
            value={formData.contestTypeName}
            onChange={handleInputChange}
            placeholder="E.g., MAHA_BONANZA"
          />

          <FormInput
            label="Sponsor Name"
            name="sponsored_name"
            value={formData.sponsored_name}
            onChange={handleInputChange}
            placeholder="Enter sponsor name"
            required
          />
          <ImageUpload
            label="Sponsor Logo"
            value={
              typeof formData.sponsored_logo_preview === "string"
                ? formData.sponsored_logo_preview
                : ""
            }
            onChange={(base64) => handleImageChange("sponsored_logo", base64)}
          />

          <ImageUpload
            label="Thumbnail"
            value={
              typeof formData.thumbnail_preview === "string"
                ? formData.thumbnail_preview
                : ""
            }
            onChange={(base64) => handleImageChange("thumbnail", base64)}
          />

          <ImageUpload
            label="Contest Image"
            value={
              typeof formData.contestImage_preview === "string"
                ? formData.contestImage_preview
                : ""
            }
            onChange={(base64) => handleImageChange("contestImage", base64)}
          />
        </FormSection>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Contest"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnlyContestForm;
