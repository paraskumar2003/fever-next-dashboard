// components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  icon = "🔍",
  className = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          placeholder={placeholder}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 text-lg">
          {typeof icon === 'string' ? icon : '🔍'}
        </div>
      </div>
    </div>
  );
};

export { SearchBar };
