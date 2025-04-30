import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
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

  return (
    <div className="mb-4">
      <label className="mb-1  block text-sm font-medium">{label}</label>
      <div className="rounded-md border border-dashed border-black/20 bg-white/5 p-4">
        <div className="flex flex-col items-center justify-center">
          {value ? (
            <div className="relative w-full">
              <img
                src={value}
                alt="Preview"
                className="mx-auto max-h-40 rounded-md object-contain"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-0 top-0 -translate-y-1/2  translate-x-1/2 transform rounded-full bg-red-500 p-1"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="text-center" onClick={handleButtonClick}>
              <Upload className="/50 mx-auto h-12 w-12" />
              <p className="/70 mt-1 text-sm">
                {isLoading ? "Loading..." : "Click or drag to upload an image"}
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 z-[-1] h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
