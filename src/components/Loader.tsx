import React from "react";
import { ClipLoader } from "react-spinners";

interface LoaderProps {
  isLoading: boolean;
  size?: number;
  color?: string;
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  size = 40,
  color = "#5d3dcb",
  overlay = true,
}) => {
  if (!isLoading) return null;

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-xl">
          <ClipLoader color={color} size={size} />
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default Loader;