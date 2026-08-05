import { z } from "zod";


export const invoiceSchema = z.object({
    id: z.number().nonnegative().nonoptional(),
    created_at: z.date().nonoptional(),
    num_invoice: z.string().nonoptional(),
    taxable: z.string().nonoptional(),
    vat: z.string().nullable(),
    total: z.string().nonoptional(),
    creation_date: z.date().nonoptional(),
    protocol_numb: z.string().nonoptional(),
    tax_id_code: z.string().nullable(),
    invoice_token: z.string().nonempty(),
});

export type invoiceType = z.infer<typeof invoiceSchema>;