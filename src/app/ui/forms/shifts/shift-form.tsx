'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import InputField from "../input-field";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  shiftSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { createShift, createShiftSeries, updateShift, updateShiftSeries } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth-context";
import { getFullAddress } from "@/app/lib/utils";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";
import { formatInTimeZone } from 'date-fns-tz';

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
      
      const [step, setStep] = useState(data ? 2 : 1);
      const [companyApproved, setCompanyApproved] = useState(true);

      const [pharmaciesList, setPharmaciesList] = useState<any>([]);

      const [selectedLocationId, setSelectedLocationId] = useState(data ? data.locationId : null);
      const [selectedCompanyId, setSelectedCompanyId] = useState(data ? data.companyId : null);
      const [selectedLocationName, setSelectedLocationName] = useState(data ? data.location?.name : null);
      const [selectedCompanyName, setSelectedCompanyName] = useState(data ? data.company.name : null);
      const currentCompanyId = useSelectedCompany((state) => state.currentCompanyId);

      const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        control,
      } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(shiftSchema),
        defaultValues: {
          repeatType: "NONE",
          status: "open",
        },
      });

      const repeatType = watch("repeatType");
      const isRepetitive = repeatType !== "NONE";
      const isWeekly = repeatType === "WEEKLY";

      // Watch the value of the published field
      const isPublished = watch("published", data ? data.published : true);

      //Remove pharmacistId if published === False
      useEffect(() => {
         if (isPublished === false) {
            setValue("pharmacistId", "");
          }
      }, [isPublished, setValue]);

       // Watch the value of the 'pharmacistId' field
      const watchedPharmacistId = useWatch({
        control,
        name: "pharmacistId",
      });

      // Use a useEffect hook to update the 'status' whenever 'watchedPharmacistId' changes
      useEffect(() => {
          const newStatus = watchedPharmacistId ? 'taken' : 'open';
          
          setValue('status', newStatus);        
      }, [repeatType, watchedPharmacistId, setValue]);

      const [state, formAction] = useFormState(
          type === "create" ?
          (repeatType === "NONE" ? createShift.bind(null, token) : createShiftSeries.bind(null,token) ) : 
          (repeatType === "NONE" ? updateShift.bind(null, token) : updateShiftSeries.bind(null, token)) ,
        {
          success: false,
          error: false,
        }
      );

      const onSubmit = handleSubmit((data) => {
        const pattern = /(?:N\/A|NA)/i;
        let finalData = data;

        if(pattern.test(data.payRate)){
          finalData = {
            ...data,
            payRate: "0.0",
          }
        }
        const result = shiftSchema.safeParse(data);

        if (!result.success) {
          console.log("ZOD ERRORS", result.error.flatten());
          return;
        }

        formAction(finalData)

      });


      useEffect(() => {
        if (state.success) {
          toast(`Shift has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          window.location.reload();
        }
      }, [state, type, setOpen])

      const formatForDatetimeLocal = (isoString: string, timeZone: string) => {
        if (!isoString) return '';
        
        // Directly format the UTC date into the string format required by the input
        // for the specific timezone provided.
        return formatInTimeZone(isoString, timeZone, "yyyy-MM-dd'T'HH:mm");
      };
        
      const {pharmacists, companies, locations } = relatedData;

    if (loading) return <div>Loading...</div>;
    if ( !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;
    const companyId = appUser.companyId || undefined;
    const locationId = appUser.locationId || undefined;
    
    useEffect(() => {
      if (!relatedData) return;

      // Approval logic
      if (role === "pharmacy_manager") {
        setCompanyApproved(relatedData.companies?.[0]?.approved ?? false);
      }
    
      // location_manager starts at step 2
      if(role==="location_manager"){
        setCompanyApproved(relatedData.companies?.[0]?.approved ?? false);
        setStep(2)
      }

      // Build unified list
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

    }, [role, relatedData, data]);

    
    const handleOptionChange = (event: { target: { value: any; }; }) => {
      const selected = JSON.parse(event.target.value);
      
      setSelectedCompanyId(selected.companyId);
      setSelectedLocationId(selected.type === "location" ? selected.id : null);

      setSelectedCompanyName(selected.company?.name || selected.name);
      setSelectedLocationName(selected.type === "location" ? selected.name : null);

      setValue("companyId", selected.companyId);
      setValue("locationId", selected.type === "location" ? selected.id : "");
    };

    //Render conditions
    const showStep1ApprovalBlock =
      !companyApproved &&
      role === "pharmacy_manager" &&
      step === 1;

    const showStep1Selection =
      companyApproved &&
      step === 1 &&
      (role === "admin" || role === "pharmacy_manager");

    const showStep2ApprovalBlock =
      !companyApproved &&
      step === 2 &&
      !data;

    const showStep2Form =
      (companyApproved || data || role === "admin") &&
      step === 2;

    function RestrictedBlock() {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10">
          <h1 className="text-2xl font-semibold text-red-600">Action Restricted</h1>
          <p className="mt-4 text-gray-700 text-center max-w-lg">
            Your company is currently not approved to post shifts.
            <br />
            Please contact the administrator to obtain approval.
          </p>
        </div>
      );
    }

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new shift" : "Update shift"}</h1>

          { showStep1ApprovalBlock && (
            <RestrictedBlock />
          )}
      
          { showStep1Selection && (
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


          { showStep2ApprovalBlock && (
            <RestrictedBlock />
          )}

          { showStep2Form && (
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

              {/* {role === "admin" ||
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
              ) : null} */}

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

              {!data ? (
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs text-gray-500">Repetitive Shift?</label>
                  <select
                    {...register("repeatType")}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    defaultValue="NONE"
                  >
                    <option value="NONE">No (Single shift)</option>
                    <option value="DAILY">Yes (Daily)</option>
                    <option value="WEEKLY">Yes (Weekly)</option>
                  </select>
                </div>
              ):(
                <div className="flex flex-col gap-2 w-full md:w-1/4">
             
                </div>
              )  }


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
                containerClassName="w-full md:w-[70%]"
              />
              <InputField
                label="Pay Rate"
                name="payRate"
                defaultValue={data?.payRate}
                register={register}
                error={errors?.payRate}
              />
              {isRepetitive && (
                <>
                  <InputField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    register={register}
                    error={errors?.startDate}
                  />

                  <InputField
                    label="End Date"
                    name="endDate"
                    type="date"
                    register={register}
                    error={errors?.endDate}
                  />
                  <InputField
                    label="Start Time (Daily)"
                    name="startMinutes"
                    type="time"
                    register={register}
                    error={errors?.startMinutes}
                  />

                  <InputField
                    label="End Time (Daily)"
                    name="endMinutes"
                    type="time"
                    register={register}
                    error={errors?.endMinutes}
                  />

                  <div className="flex items-center gap-2">
                  <input type="checkbox" {...register("excludeWeekends")} defaultChecked={false}/>
                  <label className="text-sm">Exclude weekends</label>
                </div>

                </>
              )}

              {!isRepetitive && (
                <>
                  <InputField
                  label="Start Time"
                  name="startTime"
                  type="datetime-local"
                  defaultValue={formatForDatetimeLocal(data?.startTime, data?.company.timezone)}
                  register={register}
                  error={errors?.startTime}
                  containerClassName="w-full md:w-[48%]"
                />
                  <InputField
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  defaultValue={formatForDatetimeLocal(data?.endTime, data?.company.timezone)}
                  register={register}
                  error={errors?.endTime}
                  containerClassName="w-full md:w-[48%]"
                />
              </>
              )}

              {isWeekly && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500">Days of Week</label>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { label: "Sun", value: 0 },
                      { label: "Mon", value: 1 },
                      { label: "Tue", value: 2 },
                      { label: "Wed", value: 3 },
                      { label: "Thu", value: 4 },
                      { label: "Fri", value: 5 },
                      { label: "Sat", value: 6 },
                    ].map(day => (
                      <label key={day.value} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          value={day.value}
                          {...register("daysOfWeek")}
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                  {errors.daysOfWeek?.message && ( 
                    <p className="text-xs text-red-400">
                      {errors.daysOfWeek?.message.toString()}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Published</label>
                <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("published", {
                      setValueAs: value => value === 'true'
                    })}
                    defaultValue={data ? (data.published ? "true" : "false") : "true"}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No: Draft Shift, not visible to Relief Pharmacists</option>
                  </select>
                  {errors.published?.message && ( 
                    <p className="text-xs text-red-400">
                      {errors.published?.message.toString()}
                    </p>
                  )}
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Relief Pharmacist</label>
                <select
                  className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full transition-colors ${
                              !isPublished ? "bg-gray-200" : "bg-white"
                            }`}
                  {...register("pharmacistId")}
                  disabled={!isPublished}
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