import { TypeOf, z } from "zod";
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
});

export const DatabaseSchema = z.object({
    name: z.string().nonempty(),
    lastName: z.string().nonempty(),
    address: addressSchema,
    prePhone: z.string().nonempty(),
    phone: z.string().nonempty(),
    email: z.email().nonempty(),
    pw: z.string().nonempty(),
    tk: z.string().nonempty(),
});

export const loginSchema = z.object({
    email: z.email().nonempty(),
    pw: z.string().nonempty(),
});

export const ResponseUserAPISchema = z.object({
    id: z.number(),
    data_user: formSchema.nullable(),
});

export const ResponseDatabaseAPISchema = z.object({
    id: z.number(),
    data_user: DatabaseSchema.nullable(),
});

export const cookiesSchema = z.object({
    email: z.string().nonoptional(),
    token: z.string().nonoptional(),
});

export const responseCookiesDecodedSchema = z.object({
    email: z.string().nonempty(),
    exp: z.number().nonoptional(),
    iat: z.number().nonoptional(),
    token: z.string().nonempty(),
});

export const ResCookiesSchema = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: z.string().nonempty(),
    status: z.number(),
});

export const ResponseAPISchemaUser = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: ResponseUserAPISchema,
    status: z.number(),
});

export const ResponseAPISchemaDB = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: ResponseDatabaseAPISchema,
    status: z.number(),
});

export const ResponseAPIInvoiceSchema = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: invoiceSchema,
    status: z.number(),
});

export const ResponseAPIResCookiesSchema = z.object({
    success: z.boolean().nonoptional(),
    message: z.string().nonempty(),
    data: responseCookiesDecodedSchema,
    status: z.number(),
});

export type ResponseApiSchemaUserType = z.infer<typeof ResponseAPISchemaUser>;
export type ResponseApiSchemaDBType = z.infer<typeof ResponseAPISchemaDB>;

export type formType = z.infer<typeof formSchema>;
export type DatabaseType = z.infer<typeof DatabaseSchema>;
export type loginType = z.infer<typeof loginSchema>;
export type addressType = z.infer<typeof addressSchema>;
export type ResponseUserAPIType = z.infer<typeof ResponseUserAPISchema>;
export type CookiesTypes = z.infer<typeof cookiesSchema>;
export type responseCookiesDecodedSchemaType = z.infer<typeof responseCookiesDecodedSchema>;