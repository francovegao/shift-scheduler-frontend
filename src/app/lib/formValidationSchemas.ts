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