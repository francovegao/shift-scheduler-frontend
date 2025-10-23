'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { linkManagerToCompanySchema, userSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import {  linkManagerToCompany } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { getFullAddress } from "@/app/lib/utils";
import { fetchAllCompanies } from "@/app/lib/data";

// Infer the input and output types from the schema
type FormInput = z.input<typeof linkManagerToCompanySchema>;
type FormOutput = z.output<typeof linkManagerToCompanySchema>;

export default function LinkManagerToCompanyForm({ 
  token,
  setOpen,
  data, 
  userId, 
 }: {
  userId: string;
  data?: any;
  token: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  }){

  const [isFetching, setIsFetching] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormInput, any, FormOutput>({
      resolver: zodResolver(linkManagerToCompanySchema),
    });
  
    const [state, formAction] = useFormState(
        linkManagerToCompany.bind(null, token),
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
      toast(`Manager linked to Pharmacy!`, {toastId: 'unique-toast'});
      setOpen(false);
       window.location.reload();
    }
  }, [state, setOpen])

  // Fetch companies
  useEffect(() => {
  const getAllCompanies = async () => {
    setIsFetching(true);
    try {
      const companiesResponse = await fetchAllCompanies(token);
      setCompanies(companiesResponse?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setIsFetching(false);
    }
  };
  if (token){ getAllCompanies() };
  }, [token]);
  
  if ( isFetching) return <div>Loading...</div>;

  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

        
  return(
    <form onSubmit={onSubmit}>
    <div className='p-4 flex flex-col gap-4'>
      <h2 className="text-md font-semibold mb-2">Select The Manager's Pharmacy:</h2>
        <input  
          value={userId} 
          defaultValue={userId} 
          {...register("id")}
          hidden
         />
      <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
      {companies.map((company) => (
        <li key={company.id} className="flex items-center border-b border-gray-300">
          <input
            type="radio"
            value={company.id}
            checked={selectedOption === company.id}
            {...register("companyId")}
            onChange={handleOptionChange}
            className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label className="ml-2 text-gray-700">
          <p className="font-semibold">{company?.name} : ({company?.legalName})</p>
          <p className="text-xs">{getFullAddress(company?.address, company?.city, company?.province, company?.postalCode)}</p>
        </label>
        </li>
      ))}
      </ul>
       <span className="text-center font-medium">Are you sure you want to link the selected pharmacy?</span>
        <span className="text-center font-medium">Please verify all the information before linking the pharmacy</span>
        {errors.id?.message && ( 
          <p className="text-xs text-red-400">
            {errors.id?.message.toString()}
          </p>
        )}
        {errors.companyId?.message && ( 
          <p className="text-xs text-red-400">
            {errors.companyId?.message.toString()}
          </p>
        )}
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Link Pharmacy
        </button>
        {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
    </div>
    </form>
    );
}