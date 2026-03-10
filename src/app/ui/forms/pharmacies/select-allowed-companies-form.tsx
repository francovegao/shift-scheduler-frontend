'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import z from "zod";
import { toast } from "react-toastify";
import { getFullAddress } from "@/app/lib/utils";
import { fetchAllCompanies } from "@/app/lib/data";
import { setPharmacistAllowedCompanies } from "@/app/lib/actions";
import { companyPermissionsSchema, getCompanyPermissionsSchema } from "@/app/lib/formValidationSchemas";

// Infer the input and output types from the schema
type FormInput = z.input<typeof companyPermissionsSchema>;
type FormOutput = z.output<typeof companyPermissionsSchema>;

const FORM_CONFIG = {
  set_pharmacist_permissions: {
    title: "Company & Pay Rate Permissions",
    description: "Select which pharmacies this pharmacist can access and toggle their ability to see pay rates for each.",
    footerNote: "The pharmacist will only see shifts and pay rates for the items checked above.",
    buttonText: "Save All Permissions"
  },
  set_allowed_companies: {
    title: "Select Allowed Pharmacies",
    description: "Select the pharmacies this pharmacist is authorized to see. Pay rate access is enabled by default for selected pharmacies.",
    footerNote: "Only shifts from the selected pharmacies will be visible to the pharmacist.",
    buttonText: "Save Allowed Pharmacies"
  },
  set_allowed_pay_rates: {
    title: "Manage Pay Rate Visibility",
    description: "Toggle whether the pharmacist can view pay rates for their assigned pharmacies.",
    footerNote: "Note: You are only managing pay rate visibility here; pharmacy access remains unchanged.",
    buttonText: "Update Pay Rate Access"
  }
}

export default function SelectAllowedCompaniesForm({ 
  type,
  token,
  setOpen,
  data, 
  pharmacistId, 
 }: {
  type: "set_pharmacist_permissions" | "set_allowed_companies" | "set_allowed_pay_rates",
  pharmacistId?: string;
  data?: any;
  token: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  }){

  const [isFetching, setIsFetching] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(getCompanyPermissionsSchema(type)),
    defaultValues: {
      id: pharmacistId || "",
      companyPermissions: [], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "companyPermissions",
  });

  const currentPermissions = watch("companyPermissions");

  const handleToggleCompany = (companyId: string) => {
    const index = currentPermissions.findIndex((p) => p.companyId === companyId);
    if (index === -1) {
      const canViewDefault = type === "set_allowed_companies" ? true : false;
      append({ companyId, canViewPayRate: canViewDefault });
    } else {
      if (type !== "set_allowed_pay_rates") {
        remove(index);
      }
    }
  };
    
  const [state, formAction] = useActionState(
      setPharmacistAllowedCompanies.bind(null, token),
    {
      success: false,
      error: false,
    }
  )
  
    const onSubmit = handleSubmit((data) => {
      formAction(data)
    });
  
    useEffect(() => {
      if (state.success) {
        toast(`Pharmacist Permissions Saved!`, {toastId: 'unique-toast'});
        setOpen(false);
        window.location.reload();
      }
    }, [state, setOpen])

  useEffect(() => {
    if (data?.companyPermissions) {
      const mappedPermissions = data.companyPermissions.map((p: any) => ({
        companyId: p.companyId,
        canViewPayRate: p.canViewPayRate,
      }));

      reset({
        id: pharmacistId,
        companyPermissions: mappedPermissions,
      });
    }
  }, [data, pharmacistId, reset]);

  // Fetch companies
  useEffect(() => {
  const getAllCompanies = async () => {
    setIsFetching(true);
    try {
      const companiesResponse = await fetchAllCompanies(token);
      const fetchedCompanies = companiesResponse?.data ?? [];
      setCompanies(fetchedCompanies);

      if (type === "set_allowed_pay_rates") {
        const allAsSelected = fetchedCompanies.map((c: any) => {
          
          const existing = data?.companyPermissions?.find((p: any) => p.companyId === c.id);
          return {
            companyId: c.id,
            canViewPayRate: existing?.canViewPayRate ?? false, 
          };
        });
        
        reset({
          id: pharmacistId,
          companyPermissions: allAsSelected,
        });
      }
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setIsFetching(false);
    }
  };
  if (token){ getAllCompanies() };
  }, [token, type, data, pharmacistId, reset]);
  
  if ( isFetching) return <div>Loading...</div>;

  const config = FORM_CONFIG[type];
        
    return(
    <form onSubmit={onSubmit}>
      <div className='p-4 flex flex-col gap-4'>
        <h2 className="text-md font-semibold mb-2">{config.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{config.description}</p>
        <input  
            {...register("id")}
            hidden
          />
        <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
        {companies.map((company) => {
          const permissionIndex = currentPermissions.findIndex(p => p.companyId === company.id);
          const isSelected = permissionIndex !== -1;

          return (
            <li key={company.id} className="flex items-center border-b border-gray-300">
              {type!== "set_allowed_pay_rates" && (
                <input
                  type="checkbox"
                  value={company.id}
                  checked={isSelected}
                  onChange={() => handleToggleCompany(company.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
              )}
              <label className="ml-2 text-gray-700">
                <p className="font-semibold">{company?.name} : ({company?.legalName})</p>
                <p className="text-xs">{getFullAddress(company?.address, company?.city, company?.province, company?.postalCode)}</p>
              </label>

              {isSelected && type !== "set_allowed_companies" && (
                <div className="ml-7 mt-1 flex items-center gap-2 bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    {...register(`companyPermissions.${permissionIndex}.canViewPayRate`)}
                    className="h-4 w-4"
                  />
                  <span className="text-xs font-medium text-gray-600">Can view Pay Rate?</span>
                </div>
              )}

            </li>
          )
        })}
        </ul>
        {type !=='set_allowed_pay_rates' && (
          <p className="text-sm text-gray-600">
              Pharmacies Selected: {fields.length}
          </p>
        )}
        <span className="text-sm font-medium text-gray-700">{config.footerNote}</span>
        {errors.id?.message && ( 
            <p className="text-xs text-red-400">
              {errors.id?.message.toString()}
            </p>
          )}
          {errors.companyPermissions?.message && ( 
            <p className="text-xs text-red-400">
              {errors.companyPermissions?.message.toString()}
            </p>
          )}
          <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer">
            {config.buttonText}
          </button>
          {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
      </div>
    </form>
    );
}
