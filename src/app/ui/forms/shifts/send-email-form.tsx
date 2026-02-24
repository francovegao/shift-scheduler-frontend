'use client';

import { manualEmailSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import z from "zod";
import { sendOpenShiftNotificationEmail } from "@/app/lib/actions";
import { toast } from "react-toastify";
import { fetchPharmacists } from "@/app/lib/data";

type FormInput = z.input<typeof manualEmailSchema>;
type FormOutput = z.output<typeof manualEmailSchema>;

export default function ShiftForm({ 
    type,
    data, 
    setOpen,
    token,
}:{
    type: "open_shift";
    data?: any; 
    setOpen: Dispatch<SetStateAction<boolean>>;
    token: string;
}){
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
            usersIds: [],
        },
    });

    const [state, formAction] = useFormState(
        sendOpenShiftNotificationEmail.bind(null, token),
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
            toast(`Emails sent!`, {toastId: 'unique-toast'});
            setOpen(false);
            // window.location.reload();
        }
    }, [state, setOpen])

    // Fetch companies
    useEffect(() => {
    const fetchData = async () => {
        setIsFetching(true);
        try {
            if(type==="open_shift"){
                const pharmacistsRes = await fetchPharmacists("", 1, {}, token);  
                setPharmacistsList(pharmacistsRes?.data ?? [] );
            }
        } catch (err) {
            console.error("Failed to fetch pharmacists", err);
        } finally {
            setIsFetching(false);
        }
    };

    if (token) fetchData();
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

    const allPharmacistIds = (pharmacistsList ?? [])
        .filter((p) => p && p.pharmacistProfile)
        .map((p) => p.pharmacistProfile.id);

    const isAllSelected = allPharmacistIds.length > 0 && selectedOptions.length === allPharmacistIds.length;

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const nextSelected = checked ? allPharmacistIds : [];
        
        setSelectedOptions(nextSelected);
        
        setValue("usersIds", nextSelected);
    };

    if (!data) {
        return <p>Loading...</p>;
    }

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">Send 'Open Shift' Notification Email</h1>
            <span className="text-sm text-gray-600 font-medium">
                Select pharmacists to notify via email that the selected shift is open
            </span>
            <input  
                value={data.id} 
                defaultValue={data.id} 
                {...register("id")}
                hidden
            />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 py-1">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAllChange}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                </div>

                <ul className="space-y-2 max-h-95 overflow-y-auto border p-2 rounded-md">
                {(pharmacistsList ?? [])
                .filter((pharmacist: { pharmacistProfile: any; }) => pharmacist && pharmacist.pharmacistProfile)
                .map((pharmacist:any) => (
                    <li key={pharmacist.pharmacistProfile.id} className="flex items-center border-b border-gray-300">
                        <input
                        type="checkbox"
                        value={pharmacist.pharmacistProfile.id}
                        checked={selectedOptions.includes(pharmacist.pharmacistProfile.id)}
                        {...register("usersIds")}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <label className="ml-2 text-gray-700">
                            <p className="font-semibold">{pharmacist?.firstName + " " + pharmacist?.lastName}</p>
                            <p className="text-xs">{pharmacist?.email}</p>
                        </label>
                    </li>
                ))}
                </ul>
                <p className="text-sm text-gray-600">
                    Pharmacists Selected: {selectedOptions.length}
                </p>
                <span className="text-center font-medium">Selected pharmacists will receive an email with this shift's information</span>
                {errors.id?.message && ( 
                    <p className="text-xs text-red-400">
                    {errors.id?.message.toString()}
                    </p>
                )}
                {errors.usersIds?.message && ( 
                    <p className="text-xs text-red-400">
                    {errors.usersIds?.message.toString()}
                    </p>
                )}
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer">
                    Send Emails
                </button>
                {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
            </div>
        </form>
    );
}
