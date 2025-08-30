// components/CouponAttachmentField.tsx
import React from "react";

interface Props {
  value?: File | string; // File (new upload) or S3 URL (existing)
  onChange?: (file: File) => void;
  label?: string;
  disabled?: boolean;
  isViewMode?: boolean;
  required?: boolean;
}

const getFileName = (url: string) => {
  try {
    return decodeURIComponent(url.split("/").pop() || "Attachment");
  } catch {
    return "Attachment";
  }
};

const CouponAttachmentField: React.FC<Props> = ({
  value,
  onChange,
  label = "Coupon Attachment",
  disabled = false,
  isViewMode = false,
  required = false,
}) => {
  const isExistingFile = typeof value === "string";

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">{label}</label>

      {isViewMode && isExistingFile ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {getFileName(value)}
        </a>
      ) : (
        <input
          type="file"
          accept="image/*,.pdf"
          disabled={disabled}
          required={required}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onChange?.(e.target.files[0]);
            }
          }}
        />
      )}
    </div>
  );
};

export default CouponAttachmentField;
