'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import InputField from "../input-field";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  shiftSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { createShift, updateShift } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth-context";
import { getFullAddress } from "@/app/lib/utils";

// Infer the input and output types from the schema
type FormInput = z.input<typeof shiftSchema>;
type FormOutput = z.output<typeof shiftSchema>;

export default function ShiftForm({ 
    type,
    data, 
    setOpen,
    token,
    relatedData,
    }:{
    type: "create" | "update";
    data?: any; 
    setOpen: Dispatch<SetStateAction<boolean>>;
    token: string;
    relatedData?: any;
    }){

      const { appUser, loading } = useAuth();
      
      const [step, setStep] = data ? useState(2) : useState(1);

      const [pharmaciesList, setPharmaciesList] = useState<any>([]);

      const [selectedLocationId, setSelectedLocationId] = data ? useState(data.locationId) :  useState(null);
      const [selectedCompanyId, setSelectedCompanyId] = data ? useState(data.companyId) : useState(null);
      const [selectedLocationName, setSelectedLocationName] = data ? useState(data.location?.name) :  useState(null);
      const [selectedCompanyName, setSelectedCompanyName] = data ? useState(data.company.name) : useState(null);

      const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        control,
      } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(shiftSchema),
      });

       // Watch the value of the 'pharmacistId' field
      const watchedPharmacistId = useWatch({
        control,
        name: "pharmacistId",
      });

      // Use a useEffect hook to update the 'status' whenever 'watchedPharmacistId' changes
      useEffect(() => {
        // Check if a pharmacist has been selected
        const newStatus = watchedPharmacistId ? 'taken' : 'open';
        
        // Programmatically set the new value for the 'status' field
        setValue('status', newStatus);
      }, [watchedPharmacistId, setValue]);


      const [state, formAction] = useFormState(
          type === "create" ? createShift.bind(null, token) : updateShift.bind(null, token),
        {
          success: false,
          error: false,
        }
      );

      const onSubmit = handleSubmit((data) => {
        console.log(data)
        formAction(data)
      });


      useEffect(() => {
        if (state.success) {
          toast(`Shift has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          window.location.reload();
        }
      }, [state, type, setOpen])
      
      const formatForDatetimeLocal = (isoString: string ) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
        
      const {pharmacists, companies, locations } = relatedData;

    if (loading) return <div>Loading...</div>;
    if ( !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;
    const companyId = appUser.companyId || undefined;
    const locationId = appUser.locationId || undefined;
    
    useEffect(() => {
      if(role==="location_manager"){
        return setStep(2)
      }

      if(role==="admin" || role==="pharmacy_manager"){      
        const unifiedList = [
          ...relatedData.locations.map((loc: {
            legalName: any; id: any; name: any; companyId: any; company: any; address: any; city: any; province: any; postalCode: any; 
            }) => ({
            type: "location",
            id: loc.id,
            name: loc.name,
            legalName: loc.legalName,
            companyId: loc.companyId,
            company: loc.company,
            address: loc.address,
            city: loc.city,
            province: loc.province,
            postalCode: loc.postalCode,
          })),
          ...relatedData.companies.map((c: {
            legalName: any; id: any; name: any; address: any; city: any; province: any; postalCode: any; 
            }) => ({
            type: "company",
            id: c.id,
            name: c.name,
            legalName: c.legalName,
            companyId: c.id,
            //company: c,
            address: c.address,
            city: c.city,
            province: c.province,
            postalCode: c.postalCode,
          }))
        ]
        setPharmaciesList(unifiedList);
      }

    }, [role, type, token]);

    
    const handleOptionChange = (event: { target: { value: any; }; }) => {
      const selected = JSON.parse(event.target.value);
      
      setSelectedCompanyId(selected.companyId);
      setSelectedLocationId(selected.type === "location" ? selected.id : null);

      setSelectedCompanyName(selected.company?.name || selected.name);
      setSelectedLocationName(selected.type === "location" ? selected.name : null);

      setValue("companyId", selected.companyId);
      setValue("locationId", selected.type === "location" ? selected.id : "");
    };

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new shift" : "Update shift"}</h1>

          { (step === 1 && 
            (role==="admin" || role==="pharmacy_manager")) &&
            (
            <>
              <span className="text-sm text-gray-600 font-medium">
                Select Pharmacy / Company
              </span>

              <div className="flex flex-col gap-6">

                <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
                {pharmaciesList.map((pharmacy:any) => (
                  <li key={pharmacy.id} className="flex items-center border-b border-gray-300">
                    <input
                      type="radio"
                      value={JSON.stringify(pharmacy)}
                      checked={
                        selectedCompanyId === pharmacy.companyId &&
                        selectedLocationId === (pharmacy.type === "location" ? pharmacy.id : null)
                      }
                      onChange={handleOptionChange}
                      className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <label className="ml-2 text-gray-700">
                    <p className="font-semibold">{pharmacy?.name} - {pharmacy?.legalName}</p>
                    {pharmacy.company && (
                      <p className="text-xs font-medium">{pharmacy?.company?.name} - {pharmacy?.company?.legalName}</p>
                    )}
                    <p className="text-xs">{getFullAddress(pharmacy?.address, pharmacy?.city, pharmacy?.province, pharmacy?.postalCode)}</p>
                  </label>
                  </li>
                ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-primary text-white p-2 rounded-md mt-4 cursor-pointer hover:bg-primary-100"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
            <span className="text-sm text-gray-600 font-medium">
              Shift Information
            </span>
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

              {role === "admin" || role==="pharmacy_manager" ? (
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Company</label>
                  <input
                    type="text"
                    value={selectedCompanyName || ""}
                    disabled
                    className="bg-gray-100 p-2 rounded-md text-sm w-full"
                  />

                  <input
                    type="hidden"
                    {...register("companyId")}
                    value={selectedCompanyId ?? ""}
                  />

                  {errors.companyId?.message && (
                    <p className="text-xs text-red-400">
                      {errors.companyId.message.toString()}
                    </p>
                  )}
                </div>
                ):null}

              { (//role === "pharmacy_manager" ||
                role === "location_manager") ? (
                  <InputField
                    label="Pharmacy"
                    name="companyId"
                    defaultValue={companyId}
                    register={register} 
                    error={errors?.companyId}
                    hidden
                  />
              ) : null}

              {role === "admin" ||
              role === "pharmacy_manager" ? (
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Pharmacy</label>
                  <input
                    type="text"
                    value={selectedLocationName || ""}
                    disabled
                    className="bg-gray-100 p-2 rounded-md text-sm w-full"
                  />

                  <input
                    type="hidden"
                    {...register("locationId")}
                    value={selectedLocationId ?? ""}
                  />

                  {errors.locationId?.message && (
                    <p className="text-xs text-red-400">
                      {errors.locationId.message.toString()}
                    </p>
                  )}
                </div>
              ) : null}

              {role === "location_manager" ?  (
                  <InputField
                    label="Location"
                    name="locationId"
                    defaultValue={locationId}
                    register={register} 
                    error={errors?.locationId}
                    hidden
                  />
              ) : null}


              <InputField
                label="Title"
                name="title"
                defaultValue={data?.title}
                register={register}
                error={errors?.title}
              />
                <InputField
                label="Instructions/Notes"
                name="description"
                defaultValue={data?.description}
                register={register}
                error={errors?.description}
              />
                <InputField
                label="Start Time"
                name="startTime"
                type="datetime-local"
                defaultValue={formatForDatetimeLocal(data?.startTime)}
                register={register}
                error={errors?.startTime}
              />
                <InputField
                label="End Time"
                name="endTime"
                type="datetime-local"
                defaultValue={formatForDatetimeLocal(data?.endTime)}
                register={register}
                error={errors?.endTime}
              />
              <InputField
                label="Pay Rate"
                name="payRate"
                defaultValue={data?.payRate}
                register={register}
                error={errors?.payRate}
              />
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Relief Pharmacist</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("pharmacistId")}
                  defaultValue={data?.pharmacists}
                >
                  <option value=""></option>
                  {pharmacists
                  .filter((pharmacist: { pharmacistProfile: any; }) => pharmacist && pharmacist.pharmacistProfile)
                  .map(
                    (pharmacist: { id: string; firstName: string; lastName: string; pharmacistProfile:{id:string} }) => (
                      <option
                        value={pharmacist.pharmacistProfile.id}
                        key={pharmacist.pharmacistProfile.id}
                        selected={data && pharmacist.pharmacistProfile.id === data.pharmacistId}
                      >
                        {pharmacist?.firstName + " " + pharmacist?.lastName}
                      </option>
                    )
                  )}
                </select>
                {errors.pharmacistId?.message && (
                  <p className="text-xs text-red-400">
                    {errors.pharmacistId.message.toString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Status</label>
                  <select 
                    className=" bg-gray-200 ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("status")}
                    defaultValue={data?.status}
                    disabled={true}
                  >
                    <option value="open">open</option>
                    <option value="taken">taken</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  {errors.status?.message && ( 
                    <p className="text-xs text-red-400">
                      {errors.status?.message.toString()}
                    </p>
                  )}
              </div>
            </div> 
            {state.error && <span className="text-red-500">Something went wrong!</span>}     
            <button className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer">
              {type === "create" ? "Create" : "Update"}
            </button>
            {(!data && role!=="location_manager") && (<button
              type="button"
              onClick={() => setStep(1)}
              className="bg-complementary-one text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer"
            >
              ← Back
            </button>
            )}
          </>
          )}
        </form>
    );
}