import { z } from "zod";
import { invoiceSchema } from "./invoiceSchema";

export const addressSchema = z.object({
    country: z.string().nonempty(),
    city: z.string().nonempty(),
    street: z.string().nonempty(),
    civicNum: z.string().nonempty(),
});

export const formSchema = z.object({
    name: z.string().nonempty(),
    lastName: z.string().nonempty(),
    address: addressSchema,
    prePhone: z.string().nonempty(),
    phone: z.string().nonempty(),
    email: z.email().nonempty(),
    pw: z.string().nonempty(),
    tk: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.email().nonempty(),
    pw: z.string().nonempty(),
});

export const ResponseUserAPISchema = z.object({
    id: z.number(),
    data_user: formSchema.nullable(),
});


export const ResponseAPISchema = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: ResponseUserAPISchema,
    status: z.number(),
});
export const ResponseAPIInvoiceSchema = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: invoiceSchema,
    status: z.number(),
});

export type ResponseApiType = z.infer<typeof ResponseAPISchema>;

export type formType = z.infer<typeof formSchema>;
export type loginType = z.infer<typeof loginSchema>;
export type addressType = z.infer<typeof addressSchema>;
export type ResponseUserAPIType = z.infer<typeof ResponseUserAPISchema>;