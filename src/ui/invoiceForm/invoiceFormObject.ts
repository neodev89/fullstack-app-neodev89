import { invoiceType } from "@/src/zod/invoiceSchema";

interface returnInvoiceForm {
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    name: string;
    val: string | number | Date | null;
}


export const invoiceFormObject = async (data: invoiceType[]): Promise<returnInvoiceForm[] | null> => {
    // eslint-disable-next-line prefer-const
    let res: returnInvoiceForm[] = [];
    if (Array.isArray(data) && data.length > 0) {
        data.map((el) => {
            for (const [k, v] of Object.entries(el)) {
                const newRes = {
                    type: typeof k,
                    name: k,
                    val: v
                };
                res.push(newRes);
            }
        });
        return res;
    } else {
        return null;
    }
};