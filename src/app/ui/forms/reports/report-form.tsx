import { generateAdminReport } from "@/app/lib/actions";
import { generateReportSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { fetchAllCompanies, fetchAllPharmacists } from "@/app/lib/data";
import { useState, useEffect as useEffectHook } from "react";

type FormInput = z.input<typeof generateReportSchema>;
type FormOutput = z.output<typeof generateReportSchema>;

export default function ReportForm({
  reportType,
  setOpen,
  token,
  filters,
}: {
  reportType: "shifts" | "company" | "pharmacist";
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  filters: {
    startDate?: string;
    endDate?: string;
    type: string;
    companyIds?: string[];
    pharmacistIds?: string[];
  };
}) {
  const [companies, setCompanies] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [pharmacists, setPharmacists] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loadingPharmacists, setLoadingPharmacists] = useState(false);
  const [selectedPharmacists, setSelectedPharmacists] = useState<string[]>([]);

  useEffectHook(() => {
    if (reportType === "company") {
      const loadCompanies = async () => {
        setLoadingCompanies(true);
        const companiesResponse = await fetchAllCompanies(token);
        if (companiesResponse?.data) {
          setCompanies(
            companiesResponse.data.map((c: any) => ({
              id: c.id,
              name: c.name,
            })),
          );
        }
        setLoadingCompanies(false);
      };
      loadCompanies();
    }
  }, [reportType, token]);

  useEffectHook(() => {
    if (reportType === "pharmacist") {
      const loadPharmacists = async () => {
        setLoadingPharmacists(true);
        const pharmacistsResponse = await fetchAllPharmacists(token);
        if (pharmacistsResponse?.data) {
          const mappedPharmacists = pharmacistsResponse.data
            .map((p: any) => ({
              id: p.id,
              name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
          setPharmacists(mappedPharmacists);
        }
        setLoadingPharmacists(false);
      };
      loadPharmacists();
    }
  }, [reportType, token]);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      type: filters.type as "shifts" | "company" | "pharmacist",
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      companyIds: filters.companyIds || [],
      pharmacistIds: filters.pharmacistIds || [],
    },
  });

  const [state, formAction] = useFormState(
    generateAdminReport.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success && state.url) {
      toast(`Report generated!`, { toastId: "unique-toast" });
      window.open(state.url, "_blank");
      setOpen(false);
    }
  }, [state, setOpen]);

  if (!filters) return <div>Loading...</div>;
  const isDisabled = !filters.startDate || !filters.endDate;

  const showCompanySelect = reportType === "company";
  const showPharmacistSelect = reportType === "pharmacist";

  const handleCompanyCheckboxChange = (event: {
    target: { value: any; checked: any };
  }) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCompanies((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedCompanies((prevSelected) =>
        prevSelected.filter((option) => option !== value),
      );
    }
  };

  const handlePharmacistCheckboxChange = (event: {
    target: { value: any; checked: any };
  }) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedPharmacists((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedPharmacists((prevSelected) =>
        prevSelected.filter((option) => option !== value),
      );
    }
  };

  return (
    <form className="flex flex-col gap-8 text-foreground" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a {reportType} report</h1>
      <span className="text-sm text-tx-muted font-medium">
        You will generate a {reportType} report with the next parameters:
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <input
          value={filters.type}
          defaultValue={filters.type}
          {...register("type")}
          hidden
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-tx-body-muted">From:</label>
          <input
            type="date"
            value={filters.startDate}
            defaultValue={filters.startDate}
            {...register("startDate")}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-tx-body-muted">To:</label>
          <input
            type="date"
            value={filters.endDate}
            defaultValue={filters.endDate}
            min={filters.startDate}
            {...register("endDate")}
          />
          {errors.endDate && (
            <span className="text-red-500 text-sm">
              {errors.endDate.message}
            </span>
          )}
        </div>
      </div>

      {showCompanySelect && (
        <div className="p-4 flex flex-col gap-4">
          <label className="text-tx-body-muted">
            Companies (leave empty for all):
          </label>
          {loadingCompanies ? (
            <p className="text-xs text-tx-tertiary">Loading companies...</p>
          ) : (
            <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
              {companies.map((company) => (
                <li
                  key={company.id}
                  className="flex items-center border-b border-gray-300"
                >
                  <input
                    type="checkbox"
                    value={company.id}
                    checked={selectedCompanies.includes(company.id)}
                    {...register("companyIds")}
                    onChange={handleCompanyCheckboxChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label className="ml-2 text-tx-tertiary">
                    <p className="font-semibold">{company?.name}</p>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {!selectedCompanies || selectedCompanies.length === 0 ? (
            <p className="text-xs text-tx-tertiary">
              No companies selected - will include all companies
            </p>
          ) : (
            <p className="text-xs text-tx-tertiary">
              Pharmacies Selected: {selectedCompanies.length}
            </p>
          )}
        </div>
      )}

      {showPharmacistSelect && (
        <div className="p-4 flex flex-col gap-4">
          <label className="text-tx-body-muted">
            Pharmacists (leave empty for all):
          </label>
          {loadingPharmacists ? (
            <p className="text-xs text-tx-tertiary">Loading pharmacists...</p>
          ) : (
            <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
              {pharmacists.map((pharmacist) => (
                <li
                  key={pharmacist.id}
                  className="flex items-center border-b border-gray-300"
                >
                  <input
                    type="checkbox"
                    value={pharmacist.id}
                    checked={selectedPharmacists.includes(pharmacist.id)}
                    {...register("pharmacistIds")}
                    onChange={handlePharmacistCheckboxChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label className="ml-2 text-tx-tertiary">
                    <p className="font-semibold">{pharmacist?.name}</p>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {!selectedPharmacists || selectedPharmacists.length === 0 ? (
            <p className="text-xs text-tx-tertiary">
              No pharmacists selected - will include all pharmacists
            </p>
          ) : (
            <p className="text-xs text-tx-tertiary">
              Pharmacists Selected: {selectedPharmacists.length}
            </p>
          )}
        </div>
      )}

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        disabled={isDisabled}
        className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer"
      >
        Generate {reportType} report
      </button>
    </form>
  );
}
