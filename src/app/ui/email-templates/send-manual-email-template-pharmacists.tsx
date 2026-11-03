"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { sendOpenShiftNotificationEmail } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { fetchPharmacists } from "@/app/lib/data";
import { manualEmailSchema } from "@/app/lib/formValidationSchemas";

type FormInput = z.input<typeof manualEmailSchema>;
type FormOutput = z.output<typeof manualEmailSchema>;

export default function SendManualEmailTemplatePharmacists({
  type,
  data,
  setOpen,
  token,
}: {
  type: "send_manual_pharmacists";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [pharmacistsList, setPharmacistsList] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(manualEmailSchema),
    defaultValues: {
      notificationType: "general",
      id: undefined,
      userIds: [],
    },
  });

  const [state, formAction] = useActionState(
    sendOpenShiftNotificationEmail.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Emails sent!`, { toastId: "unique-toast" });
      setOpen(false);
    }
  }, [state, setOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        if (type === "send_manual_pharmacists") {
          const pharmacistsRes = await fetchPharmacists("", 1, {}, token, 50); //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
          setPharmacistsList(pharmacistsRes?.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch pharmacists", err);
      } finally {
        setIsFetching(false);
      }
    };

    if (token) fetchData();
  }, [token, type]);

  const handleCheckboxChange = (event: {
    target: { value: any; checked: any };
  }) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedOptions((prevSelected) =>
        prevSelected.filter((option) => option !== value),
      );
    }
  };

  const allPharmacistIds = (pharmacistsList ?? [])
    .filter((p) => p && p.pharmacistProfile)
    .map((p) => p.pharmacistProfile.id);

  const isAllSelected =
    allPharmacistIds.length > 0 &&
    selectedOptions.length === allPharmacistIds.length;

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    const nextSelected = checked ? allPharmacistIds : [];

    setSelectedOptions(nextSelected);

    setValue("userIds", nextSelected);
  };

  if (isFetching) return <div>Loading...</div>;

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Send Manual Email</h1>
      <span className="text-sm text-tx-muted font-medium">
        Notify selected pharmacists using the current Email Template.{" "}
      </span>
      <span className="text-sm text-tx-muted font-medium">
        Note: If you made changes to the email template, please save it before
        sending the manual email.
      </span>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAllChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="text-sm font-medium text-tx-tertiary">
            Select All
          </span>
        </div>

        <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
          {(pharmacistsList ?? [])
            .filter(
              (pharmacist: { pharmacistProfile: any }) =>
                pharmacist && pharmacist.pharmacistProfile,
            )
            .map((pharmacist: any) => (
              <li
                key={pharmacist.pharmacistProfile.id}
                className="flex items-center border-b border-gray-300"
              >
                <input
                  type="checkbox"
                  value={pharmacist.pharmacistProfile.id}
                  checked={selectedOptions.includes(
                    pharmacist.pharmacistProfile.id,
                  )}
                  {...register("userIds")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="ml-2 text-tx-tertiary">
                  <p className="font-semibold">
                    {pharmacist?.firstName + " " + pharmacist?.lastName}
                  </p>
                  <p className="text-xs break-all">{pharmacist?.email}</p>
                </label>
              </li>
            ))}
        </ul>
        <p className="text-sm text-tx-muted">
          Pharmacists Selected: {selectedOptions.length}
        </p>
        <span className="text-center font-medium text-tx-secondary">
          Selected pharmacists will receive an email with the current email
          template.
        </span>
        {errors.id?.message && (
          <p className="text-xs text-red-400">
            {errors.id?.message.toString()}
          </p>
        )}
        {errors.userIds?.message && (
          <p className="text-xs text-red-400">
            {errors.userIds?.message.toString()}
          </p>
        )}
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer"
        >
          Send Email
        </button>
        {state.error && (
          <span className="text-red-500 text-center">
            Something went wrong!
          </span>
        )}
      </div>
    </form>
  );
}
