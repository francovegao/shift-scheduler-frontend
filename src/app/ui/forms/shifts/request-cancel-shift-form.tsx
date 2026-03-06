'use client';

import { cancelShiftRequestSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import z from "zod";
import { sendCancelShiftRequestEmail } from "@/app/lib/actions";
import { toast } from "react-toastify";
import InputField from "../input-field";

type FormInput = z.input<typeof cancelShiftRequestSchema>;
type FormOutput = z.output<typeof cancelShiftRequestSchema>;

export default function RequestCancelShiftForm({ 
    type,
    id, 
    pharmacistId,
    setOpen,
    token,
}:{
    type: "request_cancellation";
    id?: string; 
    pharmacistId: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    token: string;
}){
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(cancelShiftRequestSchema),
    });

    const isConfirmed = watch("confirmed", false);

    const [state, formAction] = useFormState(
        sendCancelShiftRequestEmail.bind(null, token),
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
            toast(`Cancellation request sent!`, {toastId: 'unique-toast'});
            setOpen(false);
            // window.location.reload();
        }
    }, [state, setOpen])

    if (!id) {
        return <p>Loading...</p>;
    }

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">Request Shift Cancellation</h1>
            <span className="text-sm text-gray-600 font-medium">
                A request to cancel this shift will be sent to the pharmacy's contact person. 
            </span>
            <input  
                value={id} 
                defaultValue={id} 
                {...register("id")}
                hidden
            />
            <input  
                value={pharmacistId} 
                defaultValue={pharmacistId} 
                {...register("pharmacistId")}
                hidden
            />
            <div className="flex flex-col gap-4">
                <InputField
                label="Enter the shift cancellation reason:"
                name="cancelReason"
                register={register}
                error={errors?.cancelReason}
                containerClassName="w-full"
                />
                <span className="text-sm text-gray-600 font-medium">
                    Please note that sending this request does not relieve you from this shift's duties until you receive the shift's cancellation confirmation from the pharmacy.
                </span>
                <div className="flex items-center justify-center gap-2">
                    <input 
                    type="checkbox" 
                    id="confirm-check"
                    {...register("confirmed")} 
                    className="w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="confirm-check" className="text-md font-semibold cursor-pointer text-black">
                    I understand
                    </label>
                </div>
                <button 
                type="submit"
                disabled={!isConfirmed}
                className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-red-600 cursor-pointer">
                    Send Request
                </button>
                {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
            </div>
        </form>
    );
}
