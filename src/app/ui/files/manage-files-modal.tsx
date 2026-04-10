import {
  CloudArrowUpIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useActionState, useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { toast } from "react-toastify";
import FileForm from "../forms/files/file-form";
import { deleteFileRecord } from "@/app/lib/actions";

export default function ManageFilesModal({
  type,
  fileType,
  token,
  data,
  id,
  ownerId,
}: {
  type: "upload" | "replace" | "delete";
  fileType: "resume" | "logo" | "profilePicture";
  token: string;
  data?: any;
  id?: string;
  ownerId?: string;
}) {
  const [open, setOpen] = useState(false);
  const { appUser, loading } = useAuth();

  const Form = () => {
    const [state, formAction] = useActionState(
      deleteFileRecord.bind(null, token),
      {
        success: false,
        error: false,
      },
    );

    useEffect(() => {
      if (state.success) {
        toast(`${fileType} has been deleted!`, { toastId: "unique-toast" });
        setOpen(false);
        window.location.reload();
      }
    }, [state]);

    return type === "delete" && id ? (
      <form className="p-4 flex flex-col gap-4" action={formAction}>
        <input type="text" name="id" value={id} hidden />
        <span className="text-center font-medium">
          Are you sure you want to delete this {fileType}?
        </span>
        <span className="text-center font-medium">
          This action cannot be undone!
        </span>
        <button
          type="submit"
          className="bg-complementary-one text-white p-2 rounded-md hover:bg-complementary-one-100 cursor-pointer"
        >
          Delete
        </button>
        {state.error && (
          <span className="text-red-500 text-center">
            Something went wrong!
          </span>
        )}
      </form>
    ) : type === "upload" && ownerId ? (
      <FileForm
        type={type}
        fileType={fileType}
        token={token}
        ownerId={ownerId}
        setOpen={setOpen}
      />
    ) : type === "replace" && data && ownerId ? (
      <FileForm
        type={type}
        fileType={fileType}
        token={token}
        ownerId={ownerId}
        setOpen={setOpen}
        data={data}
      />
    ) : (
      <div>"Something went wrong!"</div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!appUser) return <div>Please sign in to continue</div>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={clsx("rounded-md cursor-pointer p-2", {
          "flex bg-primary text-white py-2 px-4 border-none w-max self-center hover:bg-primary-100 text-sm font-normal":
            type === "upload",
          "border p-2 hover:bg-gray-200": type === "replace",
          "p-2 border hover:bg-gray-200": type === "delete",
        })}
      >
        {type === "upload" ? (
          <>
            <span className="hidden md:block">Upload {fileType}</span>
            <CloudArrowUpIcon className="h-5 md:ml-4" />{" "}
          </>
        ) : null}
        {type === "replace" ? (
          <>
            <PencilIcon className="w-5" />
          </>
        ) : null}
        {type === "delete" ? (
          <>
            <TrashIcon className="w-5" />
          </>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="w-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
