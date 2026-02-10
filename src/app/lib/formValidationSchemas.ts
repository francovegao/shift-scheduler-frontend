import z from "zod";

export const userSchema = z.object({
    id: z.string().optional(),
    email: z.email({message: "Invalid email address."}),
    password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
    firstName: z.string().min(1,{message: "First name is required."}),
    lastName: z.string().min(1,{message: "Last name is required."}),
    phone: z.string().optional(),
    role: z.string().min(1,{message: "Role is required."}),
    //files: z.instanceof(File),  //TODO: Update to work for files 
});

export type UserSchema = z.infer<typeof userSchema>;

export const linkManagerToCompanySchema = z.object({
    id: z.string({message: "User is required!"}),
    companyId: z.string({message: "Company is required, Please select one!"}),
    locationId: z.string().optional(),
});

export type LinkManagerToCompanySchema = z.infer<typeof linkManagerToCompanySchema>;

export const linkManagerToLocationSchema = z.object({
    id: z.string({message: "User is required!"}),
    companyId: z.string({message: "Company is required, Please select one!"}),
    locationId: z.string({message: "Location is required, Please select one!"}),
});

export type LinkManagerToLocationSchema = z.infer<typeof linkManagerToLocationSchema>;

export const companySchema = z.object({
    id: z.string().optional(),
    approved: z.coerce.boolean({message: "Status is required."}),
    name: z.string().min(3,{message: "Pharmacy name is required."}),
    legalName: z.string().optional(),
    GSTNumber: z.string().optional(),
    email: z.email({message: "Invalid email address."}),
    phone: z.string().min(1,{message: "Phone is required."}),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().min(2,{message: "Province is required."}),
    postalCode: z.string().optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;

export const locationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3,{message: "Location name is required."}),
    legalName: z.string().optional(),
    GSTNumber: z.string().optional(),
    email: z.email({message: "Invalid email address."}),
    phone: z.string().min(1,{message: "Phone is required."}),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().min(2,{message: "Province is required."}),
    postalCode: z.string().optional(),
    companyId: z.string().min(3,{message: "Pharmacy is required."}),
});

export type LocationSchema = z.infer<typeof locationSchema>;

export const pharmacistSchema = z.object({
    id: z.string().optional(),
    userId: z.string({ message: "User ID is required!" }),
    licenseNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().min(2,{message: "Province is required."}),
    postalCode: z.string().optional(),
    email: z.email({ message: "Invalid email address!" }).optional().or(z.literal("")),
    bio: z.string().optional(),
    experienceYears: z.coerce.number().optional(),
    approved: z.coerce.boolean({message: "Status is required."}),
    canViewAllCompanies: z.coerce.boolean({message: "View all Pharmacies? is required."}),
});

export type PharmacistSchema = z.infer<typeof pharmacistSchema>;

export const allowedCompaniesSchema = z.object({
    id: z.string({ message: "User ID is required!" }),
    //companyId: z.string({ message: "Company ID is required!" }),
    companiesArray: z.array(z.string()),
    //companiesArray: z.array(z.object({companyId: z.string({ message: "Company ID is required!" })})),
});

export type AllowedCompaniesSchema = z.infer<typeof allowedCompaniesSchema>;

export const singleShiftSchema = z.object({
  repeatType: z.literal("NONE"),

  id: z.string().optional(),
  companyId: z.string().min(1,{message: "Company is required."}),
  locationId: z.string().optional(),  
  title: z.string(),
  description: z.string().optional(),
  startTime: z.coerce.string({message: "Start date is required"}),
  endTime: z.coerce.string({message: "End date is required"}),
  payRate: z.string().min(1,{message: "Pay rate is required."}),
  status: z.enum(["open", "taken", "cancelled", "completed"]),
  published: z.coerce.boolean({message: "Published is required."}),
  pharmacistId: z.string().optional(),

  //extra fields not needed for single shift
  startMinutes: z.any().optional(), 
  endMinutes: z.any().optional(),
  startDate: z.any().optional(), 
  endDate: z.any().optional(),
  daysOfWeek: z.any().optional(),
  excludeWeekends: z.any().optional(),
});

export type SingleShiftSchema = z.infer<typeof singleShiftSchema>;

export const seriesShiftSchema = z.object({
  repeatType: z.enum(["DAILY", "WEEKLY"]),

  id: z.string().optional(),
  companyId: z.string().min(1,{message: "Company is required."}),
  locationId: z.string().optional(),  
  title: z.string(),
  description: z.string().optional(),
  payRate: z.string().min(1,{message: "Pay rate is required."}),
  startMinutes: z.string().min(1,{message: "Start time is required."}),
  endMinutes: z.string().min(1,{message: "End time is required."}),
  daysOfWeek: z.array(z.coerce.number().int()).default([]),
  startDate: z.coerce.date({message: "Start date is required"}),
  endDate: z.coerce.date({message: "End date is required"}),
  excludeWeekends: z.coerce.boolean().default(false),
  published: z.coerce.boolean({message: "Published is required."}),

  status: z.enum(["open", "taken", "cancelled", "completed"]),
  pharmacistId: z.string().optional(),

  //extra fields not needed for Shift Seried
  startTime: z.any().optional(), 
  endTime: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.repeatType === "WEEKLY" && (!data.daysOfWeek || data.daysOfWeek.length === 0)) {
    ctx.addIssue({
      path: ["daysOfWeek"],
      message: "Select at least one day for weekly shifts",
      code: "custom",
    });
  }
});

export type SeriesShiftSchema = z.infer<typeof seriesShiftSchema>;

export const shiftSchema = z.discriminatedUnion("repeatType", [
  singleShiftSchema,
  seriesShiftSchema,
]);

export type ShiftSchema = z.infer<typeof shiftSchema>;

export const takeShiftSchema = z.object({
  id: z.string().min(1,{message: "Shift ID is required"}),
  status: z.enum(["open", "taken", "cancelled", "completed"]),
  pharmacistId: z.string().min(1,{message: "Pharmacist ID is required"}),
});

export type TakeShiftSchema = z.infer<typeof takeShiftSchema>;

