import z from "zod";

export const userSchema = z.object({
    id: z.string().optional(),
    email: z.email({message: "Invalid email address."}),
    firstName: z.string().min(1,{message: "First name is required."}),
    lastName: z.string().min(1,{message: "Last name is required."}),
    phone: z.string().optional(),
    role: z.string().min(1,{message: "Role is required."}),
    //files: z.instanceof(File),  //TODO: Update to work for files 
});

export type UserSchema = z.infer<typeof userSchema>;

export const companySchema = z.object({
    id: z.string().optional(),
    approved: z.coerce.boolean({message: "Status is required."}),
    name: z.string().min(3,{message: "Name is required."}),
    email: z.email({message: "Invalid email address."}),
    phone: z.string().min(1,{message: "Phone is required."}),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().min(2,{message: "Province is required."}),
    postalCode: z.string().optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;