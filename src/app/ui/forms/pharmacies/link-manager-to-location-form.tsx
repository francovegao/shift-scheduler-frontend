'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { linkManagerToLocationSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import {  linkManagerToCompany } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { getFullAddress } from "@/app/lib/utils";
import { fetchAllLocations } from "@/app/lib/data";

// Infer the input and output types from the schema
type FormInput = z.input<typeof linkManagerToLocationSchema>;
type FormOutput = z.output<typeof linkManagerToLocationSchema>;

export default function LinkManagerToLocationForm({ 
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
  const [locations, setLocations] = useState<any[]>([]);

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormInput, any, FormOutput>({
      resolver: zodResolver(linkManagerToLocationSchema),
    });
  
    const [state, formAction] = useFormState(
        linkManagerToCompany.bind(null, token),
      {
        success: false,
        error: false,
      }
    )

  const onSubmit = handleSubmit((data) => {
    const [locationId, companyId] = data.locationId.split(',');

    const finalData = {
      id: data.id, 
      locationId: locationId,
      companyId: companyId,
    };
    
    formAction(finalData)
  });

  useEffect(() => {
    if (state.success) {
      toast(`Manager linked to Location!`, {toastId: 'unique-toast'});
      setOpen(false);
      window.location.reload();
    }
  }, [state, setOpen])

  // Fetch locations
  useEffect(() => {
  const getAllLocations = async () => {
    setIsFetching(true);
    try {
      const locationsResponse = await fetchAllLocations(token);
      setLocations(locationsResponse?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch lcoations", err);
    } finally {
      setIsFetching(false);
    }
  };
  if (token){ getAllLocations() };
  }, [token]);
  
  if ( isFetching) return <div>Loading...</div>;

  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    const [locationId, companyId] = value.split(',');
    setSelectedLocationId(locationId);
    setSelectedCompanyId(companyId);
  };

        
  return(
    <form onSubmit={onSubmit}>
    <div className='p-4 flex flex-col gap-4'>
      <h2 className="text-md font-semibold mb-2">Select The Manager's Location:</h2>
        <input  
          value={userId} 
          defaultValue={userId} 
          {...register("id")}
          hidden
         />
         <input  
          value={selectedCompanyId ?? ""}
          {...register("companyId")}
          hidden
         />
      <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
      {locations.map((location) => (
        <li key={location.id} className="flex items-center border-b border-gray-300">
          <input
            type="radio"
            value={`${location.id},${location.companyId}`}
            checked={selectedLocationId === location.id}
            {...register("locationId")}
            onChange={handleOptionChange}
            className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label className="ml-2 text-gray-700">
          <p className="font-semibold">{location?.name} : ({location?.legalName})</p>
          <p className="text-xs">{location?.company?.name}</p>
          <p className="text-xs">{getFullAddress(location?.address, location?.city, location?.province, location?.postalCode)}</p>
        </label>
        </li>
      ))}
      </ul>
       <span className="text-center font-medium">Are you sure you want to link the selected location?</span>
        <span className="text-center font-medium">Please verify all the information before linking the location</span>
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
        {errors.locationId?.message && ( 
          <p className="text-xs text-red-400">
            {errors.locationId?.message.toString()}
          </p>
        )}
        <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer">
          Link Location
        </button>
        {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
    </div>
    </form>
    );
}