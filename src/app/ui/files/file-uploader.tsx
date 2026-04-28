"use client";

import { CloudArrowUpIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

type Props = {
  fileType: "resume" | "logo" | "profilePicture";
  value: File | null;
  onChange: (file: File | null) => void;
  maxSize: number;
  label?: string;
};

export default function FileUploader({
  fileType,
  value,
  onChange,
  maxSize,
  label,
}: Props) {
  const MAX_SIZE = maxSize;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manage Preview URL to prevent memory leaks
  useEffect(() => {
    if (value && value.type !== "application/pdf") {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [value]);

  const handleFileSelect = async (file?: File) => {
    setErrorMessage(null);
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setErrorMessage(
        `File must be smaller than ${(maxSize / (1024 * 1024)).toFixed(2)} MB`,
      );
      return;
    }

    const isImage = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ].includes(file.type);
    const isPDF = file.type === "application/pdf";

    if (
      (fileType === "resume" && !isPDF) ||
      (fileType !== "resume" && !isImage)
    ) {
      setErrorMessage(
        `Invalid file format. Please select a ${fileType === "resume" ? "PDF" : "valid image"}.`,
      );
      return;
    }

    if (isImage && (fileType === "profilePicture" || fileType === "logo")) {
      setIsCompressing(true);
      try {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1024 };
        const compressedFile = await imageCompression(file, options);
        onChange(compressedFile);
      } catch (error) {
        setErrorMessage("Image processing failed.");
      } finally {
        setIsCompressing(false);
      }
    } else {
      onChange(file);
    }

    // allow re-selecting same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const accept =
    fileType === "resume"
      ? "application/pdf,.pdf"
      : "image/jpeg, image/png, image/webp, image/avif, .jpg, .jpeg, .png, .webp, .avif";

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
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            handleFileSelect(selectedFile);
          }
        }}
      />

      <div className="relative w-32 h-32">
        {!value && !isCompressing && (
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              fileInputRef.current?.click();
            }}
            className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition text-gray-500"
          >
            <span className="text-2xl font-light">+</span>
            <span className="text-[10px] uppercase font-bold">Add File</span>
          </button>
        )}

        {isCompressing && (
          <div className="w-full h-full border-2 border-blue-400 bg-blue-50 rounded-lg flex flex-col items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-[10px] font-bold text-blue-600 uppercase">
              Processing...
            </span>
          </div>
        )}

        {value && !isCompressing && (
          <div
            className="group relative w-full h-full cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {value.type === "application/pdf" ? (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border p-2 text-center">
                <span className="text-[10px] font-bold text-red-500 break-all">
                  {value.name}
                </span>
              </div>
            ) : (
              previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg border"
                  unoptimized
                />
              )
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition rounded-lg">
              Change
            </div>
          </div>
        )}
      </div>

      {value && !isCompressing && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500">
            {(value.size / (1024 * 1024)).toFixed(2)} MB
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-complementary-one text-white px-2 py-1 rounded-md text-sm hover:bg-complementary-one-100 cursor-pointer"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          </div>
        </div>
      )}
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}
