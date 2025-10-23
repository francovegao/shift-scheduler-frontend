'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  allowedCompaniesSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { getFullAddress } from "@/app/lib/utils";
import { fetchAllCompanies } from "@/app/lib/data";
import { setPharmacistAllowedCompanies } from "@/app/lib/actions";

// Infer the input and output types from the schema
type FormInput = z.input<typeof allowedCompaniesSchema>;
type FormOutput = z.output<typeof allowedCompaniesSchema>;

export default function SelectAllowedCompaniesForm({ 
  token,
  setOpen,
  data, 
  pharmacistId, 
 }: {
  pharmacistId?: string;
  data?: any;
  token: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  }){

  const [isFetching, setIsFetching] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(allowedCompaniesSchema),
        defaultValues: {
          companiesArray: [], // Initialize the array
        },
      });
    
      const [state, formAction] = useFormState(
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
        toast(`Companies Allowed Saved!`, {toastId: 'unique-toast'});
        setOpen(false);
        window.location.reload();
      }
    }, [state, setOpen])

    //Read current allowed pharmacies from selected Pharmacist
    useEffect(() => {
    if (data?.allowedCompanies && data?.allowedCompanies.length > 0) {
      
      const companyIds = data.allowedCompanies.map((company: { id: string; }) => company.id);

      //Check the current allowed pharmacies 
      setSelectedOptions(companyIds);
    }
  }, [data]); 

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

  const handleCheckboxChange = (event: { target: { value: any; checked: any; }; }) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedOptions((prevSelected) =>
        prevSelected.filter((option) => option !== value)
      );
    }
  };
        
    return(
    <form onSubmit={onSubmit}>
    <div className='p-4 flex flex-col gap-4'>
      <h2 className="text-md font-semibold mb-2">Select Allowed Pharmacies:</h2>
      <input  
          value={pharmacistId} 
          defaultValue={pharmacistId} 
          {...register("id")}
          hidden
         />
      <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
      {companies.map((company) => (
        <li key={company.id} className="flex items-center border-b border-gray-300">
          <input
            type="checkbox"
            value={company.id}
            checked={selectedOptions.includes(company.id)}
            {...register("companiesArray")}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label className="ml-2 text-gray-700">
          <p className="font-semibold">{company?.name} : ({company?.legalName})</p>
          <p className="text-xs">{getFullAddress(company?.address, company?.city, company?.province, company?.postalCode)}</p>
        </label>
        </li>
      ))}
      </ul>
      <span className="text-center font-medium">Pharmacist will only be able to see shifts from the selected pharmacies</span>
      {errors.id?.message && ( 
          <p className="text-xs text-red-400">
            {errors.id?.message.toString()}
          </p>
        )}
        {errors.companiesArray?.message && ( 
          <p className="text-xs text-red-400">
            {errors.companiesArray?.message.toString()}
          </p>
        )}
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Save Allowed Pharmacies
        </button>
        {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Selected: {selectedOptions.length}
        </p>
      </div>
    </div>
    </form>
    );
}