import {
  ArrowRightIcon,
  BeakerIcon,
  EyeIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import PreviewEmailTemplate from "./preview-email-template";
import SendTestEmailTemplate from "./send-test-email-template";
import SendManualEmailTemplatePharmacists from "./send-manual-email-template-pharmacists";
import Link from "next/link";

export default function EmailTemplatesActionsModal({
  type,
  token,
  data,
  templateKey,
}: {
  type:
    | "preview"
    | "send_test"
    | "send_manual_pharmacists"
    | "send_manual_shift_pharmacists";
  token: string;
  data?: any;
  templateKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const { appUser, loading } = useAuth();

  const Form = () => {
    return type === "preview" && data && templateKey ? (
      <PreviewEmailTemplate
        type={type}
        token={token}
        templateKey={templateKey}
        data={data}
      />
    ) : type === "send_test" && data && templateKey ? (
      <SendTestEmailTemplate
        type={type}
        token={token}
        templateKey={templateKey}
        data={data}
        setOpen={setOpen}
      />
    ) : type === "send_manual_pharmacists" ? (
      <SendManualEmailTemplatePharmacists
        type={type}
        token={token}
        setOpen={setOpen}
      />
    ) : type === "send_manual_shift_pharmacists" ? (
      <div className="gap-4 p-4 py-6">
        <p className="mb-4">
          To send a specific shift email notification please go to the shift
          list page and select the specific shift to notify about.
        </p>
        <Link
          href={`/dashboard/shifts?page=1&status=open`}
          className="inline-flex items-center text-blue-400 hover:underline hover:text-foreground"
        >
          View open shifts
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
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
        className={clsx(
          "inline-flex items-center gap-2 rounded-md border border-surface-muted px-3 py-2 text-sm font-medium hover:bg-gray-200 hover:text-primary",
          {},
        )}
      >
        {type === "preview" ? (
          <>
            <EyeIcon className="w-5" />
            Preview
          </>
        ) : null}
        {type === "send_test" ? (
          <>
            <BeakerIcon className="w-5" />
            Send Test
          </>
        ) : null}
        {type === "send_manual_pharmacists" ||
        type === "send_manual_shift_pharmacists" ? (
          <>
            <PaperAirplaneIcon className="w-5" />
            Send to Users
          </>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-surface p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
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
