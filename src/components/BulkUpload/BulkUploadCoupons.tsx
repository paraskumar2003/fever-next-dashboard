import React, { useState, useEffect } from "react";
import { CheckCircle, Download, Upload, X } from "lucide-react";
import { Modal } from "@mui/material";
import Button from "../Button";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import { SearchBar } from "../Forms";
import { RewardServices } from "@/services/rewards/reward";
import { CouponServices } from "@/services/rewards/coupon";
import { Reward } from "@/types/rewards";
import Notiflix from "notiflix";

interface BulkUploadCouponsProps {
  searchString: string;
  onSearchChange: (text: string) => void;
  onUploadSuccess?: () => void;
}

const BulkUploadCoupons: React.FC<BulkUploadCouponsProps> = ({
  searchString,
  onSearchChange,
  onUploadSuccess,
}) => {
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedRewardId, setSelectedRewardId] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCoupon, setUploadedCoupon] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data } = await RewardServices.getRewards({
          pageSize: 100,
          reward_type: "DIGITAL",
        });
        if (data?.data?.rows) {
          setRewards(data.data.rows);
          // Set first reward as default
          if (data.data.rows.length > 0) {
            setSelectedRewardId(data.data.rows[0].id);
            setBrandName(data.data.rows[0].brand_name);
          }
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };
    fetchRewards();
  }, []);

  const handleBulkUploadClick = () => {
    setShowBulkUploadModal(true);
    setUploadSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        Notiflix.Notify.failure(
          "Please select a valid Excel file (.xlsx or .xls)",
        );
        return;
      }
      setSelectedExcelFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedExcelFile) {
      Notiflix.Notify.failure("Please select an Excel file first");
      return;
    }

    if (!selectedRewardId) {
      Notiflix.Notify.failure("Please select a reward");
      return;
    }

    if (!brandName.trim()) {
      Notiflix.Notify.failure("Please enter a brand name");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("excel", selectedExcelFile);
      formData.append("rewardId", selectedRewardId);
      formData.append("brand_name", brandName.trim());

      const response = await CouponServices.bulkUploadCoupons(formData);

      let insertedCoupon = response.data.data.inserted;
      setUploadSuccess(true);
      setUploadedCoupon(insertedCoupon);

      if (response.data) {
        Notiflix.Notify.success("Coupons uploaded successfully!");
        setSelectedExcelFile(null);
        setBrandName("");
        // Call the success callback to refresh the coupons list
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        Notiflix.Notify.failure(
          response.response?.message || "Failed to upload coupons",
        );
      }
    } catch (error) {
      console.error("Error uploading coupons:", error);
      Notiflix.Notify.failure("An error occurred while uploading coupons");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setSelectedExcelFile(null);
    setBrandName("");
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRewardId(e.target.value);
    setBrandName(
      rewards.find((reward) => reward.id === e.target.value)?.brand_name || "",
    );
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandName(e.target.value);
  };

  const handleBulkDownloadClick = () => {
    const link = document.createElement("a");
    link.href = "/files/coupons-sample.xlsx"; // relative to the public folder
    link.download = "coupons-sample.xlsx"; // desired file name for download
    link.click();
  };

  return (
    <>
      <div className="my-4 flex items-center gap-4">
        <div className="flex-1">
          <SearchBar value={searchString} onChange={onSearchChange} />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkDownloadClick}
          title="Download Sample File"
          className="flex items-center gap-2 p-1"
        >
          <Download className="h-4 w-4" />
          <span className="pl-1">Sample File</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkUploadClick}
          title="Bulk Upload Coupons"
          className="flex items-center gap-2 p-1"
        >
          <Upload className="h-4 w-4" />
          <span className="pl-1">Bulk Upload</span>
        </Button>
      </div>

      {/* Bulk Upload Modal */}
      <Modal
        open={showBulkUploadModal}
        onClose={handleCloseBulkUploadModal}
        aria-labelledby="bulk-upload-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {uploadSuccess ? "Upload Successful" : "Bulk Upload Coupons"}
              </h2>
              <button
                onClick={handleCloseBulkUploadModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {uploadSuccess ? (
              <div className="space-y-4 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="text-lg font-medium text-gray-800">
                  {uploadedCoupon} Coupons Uploaded Successfully!
                </h3>
                <p className="text-sm text-gray-600">
                  Your coupon file was uploaded and processed successfully.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={handleCloseBulkUploadModal}>Close</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      Upload an Excel file (.xlsx or .xls) containing coupons.
                    </p>
                    <p className="text-xs text-gray-500">
                      Make sure your Excel file follows the required format with
                      proper columns for coupon codes, pins, and other details.
                    </p>
                  </div>

                  <FormSelect
                    label="Reward"
                    value={selectedRewardId}
                    onChange={handleRewardChange}
                    options={[
                      { value: "", label: "Select a reward" },
                      ...rewards.map((reward) => ({
                        value: reward.id,
                        label: `${reward.name} - ${reward?.brand_name} (${reward.reward_type}) ${reward.reward_type === "DIGITAL" ? `- Balance Coupons (${reward?.total_coupons - reward?.used_coupons})` : ""}`,
                      })),
                    ]}
                    disabled={isUploading}
                    required
                  />

                  <FormInput
                    label="Brand Name"
                    value={brandName}
                    onChange={handleBrandNameChange}
                    placeholder="Enter brand name"
                    disabled={isUploading}
                    required
                    readOnly={true}
                  />

                  <FormInput
                    label="Select Excel File"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    required
                  />

                  {selectedExcelFile && (
                    <div className="text-sm text-green-600">
                      Selected file: {selectedExcelFile.name}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseBulkUploadModal}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBulkUpload}
                    disabled={
                      !selectedExcelFile ||
                      !selectedRewardId ||
                      !brandName.trim() ||
                      isUploading
                    }
                  >
                    {isUploading ? "Uploading..." : "Upload Coupons"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkUploadCoupons;
