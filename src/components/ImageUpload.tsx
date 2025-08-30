import React, { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
  required,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        <span>{label}</span>
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-primary-400 hover:bg-primary-50">
        <div className="relative flex flex-col items-center justify-center">
          {value ? (
            <div className="relative w-full">
              <img
                src={value}
                alt="Preview"
                className="mx-auto max-h-48 rounded-lg object-contain shadow-sm"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="text-center" onClick={handleButtonClick}>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-600">
                {isLoading ? "Uploading..." : "Click to upload an image"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
