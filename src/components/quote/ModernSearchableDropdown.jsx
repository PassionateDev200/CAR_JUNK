/** route: src/components/quote/ModernSearchableDropdown.jsx */
"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, CheckCircle } from "lucide-react";

const ModernSearchableDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  disabled = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    const exactMatch = options.find(
      (option) => option.toString().toLowerCase() === inputValue.toLowerCase()
    );

    if (exactMatch) {
      onChange(exactMatch);
    } else if (inputValue === "") {
      onChange("");
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
      setSearchTerm("");
    }
  };

  const displayValue = value || searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={loading ? "Loading..." : placeholder}
          disabled={disabled || loading}
          className={`w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            disabled || loading
              ? "bg-gray-100 cursor-not-allowed text-gray-500"
              : "hover:border-gray-400"
          } ${value ? "border-green-300 bg-green-50" : ""}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : value ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && !disabled && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                  value === option
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-900"
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              {searchTerm ? "No options found" : "No options available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernSearchableDropdown;
