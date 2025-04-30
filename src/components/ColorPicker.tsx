import React, { useState } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F033FF",
    "#FF33F0",
    "#33FFF0",
    "#F0FF33",
    "#000000",
    "#FFFFFF",
    "#888888",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
  ];

  return (
    <div className="relative mb-4">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex items-center">
        <div
          className="mr-2 h-10 w-10 cursor-pointer rounded-md border border-black/20"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-black/20 bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 grid grid-cols-5 gap-2 rounded-md border border-black/20 bg-gray-800 p-2 shadow-lg">
          {presetColors.map((color) => (
            <div
              key={color}
              className="h-6 w-6 cursor-pointer rounded-md border border-white/20"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ColorPicker;
