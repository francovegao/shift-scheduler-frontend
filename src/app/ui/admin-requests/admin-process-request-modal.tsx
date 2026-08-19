import { WrenchScrewdriverIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ProcessCancelRequestForm from "../cancel-requests/process-cancel-request-form";
import ProcessAddPharmacistRequestForm from "../pharmacist-requests/process-add-pharmacist-request-form";

export default function AdminProcessRequestModal({
  type,
  token,
  data,
  adminName,
}: {
  type: "cancel_shift" | "add_pharmacist";
  adminName?: string | undefined;
  data: any;
  token: string;
}) {
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "cancel_shift" && adminName ? (
      <div>
        <ProcessCancelRequestForm
          adminName={adminName}
          token={token}
          data={data}
          setOpen={setOpen}
        />
      </div>
    ) : type === "add_pharmacist" ? (
      <div>
        <ProcessAddPharmacistRequestForm
          token={token}
          data={data}
          setOpen={setOpen}
        />
      </div>
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md cursor-pointer border p-2 hover:bg-gray-200"
      >
        <>
          <WrenchScrewdriverIcon className="w-5" />
        </>
      </button>

      {open && (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-surface p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-scroll">
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
