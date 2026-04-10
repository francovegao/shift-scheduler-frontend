"use client";

import {
  createFileRecord,
  getSignedUrl,
  updateFileRecord,
  uploadFile,
} from "@/app/lib/actions";
import { fileSchema, FileSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import FileUploader from "../../files/file-uploader";
import { getDisplayFileName } from "@/app/lib/utils";
import InputField from "../input-field";

type FormInput = z.input<typeof fileSchema>;
type FormOutput = z.output<typeof fileSchema>;

export default function FileForm({
  type,
  fileType,
  data,
  setOpen,
  token,
  ownerId,
}: {
  type: "upload" | "replace";
  fileType: "resume" | "logo" | "profilePicture";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  ownerId?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setErrorMessage(null);

    if (selectedFile) {
      // Sync the selected file name with Zod/React Hook Form
      setValue("fileName", selectedFile.name, { shouldValidate: true });
      setValue("mimeType", selectedFile.type);
    } else {
      setValue("fileName", "");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      userId: fileType !== "logo" ? ownerId : undefined,
      companyId: fileType === "logo" ? ownerId : undefined,
      fileName: "",
      fileUrl: "testUrl",
      mimeType: "",
      size: 100,
      type: fileType,
    },
  });

  const [state, formAction] = useActionState(
    type === "upload"
      ? createFileRecord.bind(null, token)
      : updateFileRecord.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit(async (formData) => {
    setErrorMessage(null);

    if (!file) {
      setErrorMessage("Select a pdf document to upload");
      return;
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; //5MB

    if (file.size > MAX_SIZE_BYTES) {
      toast(`File is too large! Maximum size is 5MB.`, {
        toastId: "unique-toast",
      });
      return;
    }

    let publicUrl = "";
    let cleanFileName = "";
    setLoading(true);

    try {
      cleanFileName = `${file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()}`;

      const res = await getSignedUrl(token, cleanFileName, file.type);

      if (!res || !res.url) {
        throw new Error("Failed to get signed URL");
      }

      cleanFileName = res.fileName;
      publicUrl = res.publicUrl;

      const uploadRes = await uploadFile(res.url, file);

      if (!uploadRes.success) {
        throw new Error("Upload failed");
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
      setErrorMessage("Unable to upload file");
      return;
    }

    const finalData = {
      ...formData,
      userId: fileType !== "logo" ? ownerId : undefined,
      companyId: fileType === "logo" ? ownerId : undefined,
      fileName: cleanFileName,
      fileUrl: publicUrl,
      mimeType: file.type,
      size: file.size,
      type: fileType,
    };

    formAction(finalData);
    setLoading(false);
  });

  useEffect(() => {
    if (state.success) {
      toast(`File has been ${type === "upload" ? "uploaded" : "replaced"}!`, {
        toastId: "unique-toast",
      });
      setOpen(false);
      window.location.reload();
    }
  }, [state, type, setOpen]);

  return (
    <form className="flex flex-col gap-8 text-black" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "upload" ? `Upload ${fileType}` : `Replace ${fileType}`}
      </h1>
      {data ? (
        <span className="text-xs text-gray-400 font-medium">
          Select File to Replace: {getDisplayFileName(data.fileName)}
        </span>
      ) : (
        <span className="text-xs text-gray-400 font-medium">Select File</span>
      )}

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <FileUploader
          label={`Upload ${fileType} (max. 10 mb)`}
          value={file || null}
          onChange={(file) => handleFileChange(file)}
        />
        {errors.fileName?.message && (
          <p className="text-xs text-red-400">
            {errors.fileName.message.toString()}
          </p>
        )}
        {errorMessage && (
          <p className="text-xs text-red-400">{errorMessage.toString()}</p>
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      {!loading && (
        <button className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer">
          {type === "upload" ? `Upload ${fileType}` : `Replace ${fileType}`}
        </button>
      )}
    </form>
  );
}
