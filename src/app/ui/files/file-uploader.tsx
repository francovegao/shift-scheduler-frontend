"use client";

import { CloudArrowUpIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  label?: string;
};

export default function FileUploader({
  value,
  onChange,
  maxSizeMB = 10,
  label,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_SIZE = maxSizeMB * 1024 * 1024;

  const handleFileSelect = (file?: File) => {
    if (!file) return;

    if (file.size > MAX_SIZE) {
      //setErrorMessage(`File must be smaller than ${maxSizeMB}MB`)
      return;
    }

    onChange(file);

    // allow re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-center">
      {label && (
        <label
          className="text-xs text-gray-500 flex items-center gap-2"
          htmlFor="resume"
        >
          <CloudArrowUpIcon className="w-5" />
          <span>{label}</span>
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            handleFileSelect(selectedFile);
          }
        }}
      />

      {!value ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition text-gray-500"
        >
          <span className="text-2xl font-light">+</span>
          <span className="text-[10px] uppercase font-bold">Add File</span>
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            className="relative w-32 h-32 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {value.type === "application/pdf" ? (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border">
                <span className="text-xs font-bold text-red-500">
                  {value.name}
                </span>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(value)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm transition rounded-lg">
              Select Other
            </div>
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-2">
            {(value.size / (1024 * 1024)).toFixed(2)} MB
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-secondary text-white p-2 rounded-md hover:bg-secondary-100 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Other
            </button>
            <button
              type="button"
              className="bg-complementary-one text-white p-2 rounded-md hover:bg-complementary-one-100 cursor-pointer"
              onClick={() => onChange(null)}
            >
              <XCircleIcon className="w-6 font-bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
