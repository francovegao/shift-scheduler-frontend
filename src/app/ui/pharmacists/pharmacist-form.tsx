'use client';

import z from "zod";

const schema = z.object({
  name: z.string(),
});

export default function PharmacistForm({ 
    type,
    data, }: {
    type: "create" | "update";
    data?: any; 
    }){
    return(
        <form className="">input</form>
    );
}