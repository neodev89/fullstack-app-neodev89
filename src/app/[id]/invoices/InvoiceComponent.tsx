'use client'

import { useState, useEffect } from "react";
import { tokenProps } from "@/src/interfaces/tokenProps";
import { customFetch } from "@/src/lib/fetch/customFetch";
import { responseApiObj, ResponseApiProps } from "@/src/responseAPI/responseApi";
import { invoiceFormObject } from "@/src/ui/invoiceForm/invoiceFormObject";
import { ResponseUserAPIType } from "@/src/zod/formSchema";
import { invoiceType } from "@/src/zod/invoiceSchema";

export default function InvoiceComponent() {

    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<invoiceType[]>([]);
    const [errrMsg, setErrorMsg] = useState<string>("");

    const fullData = async () => {
        try {
            const responseData = await customFetch({
                isPy: false,
                method: "get",
                url: "/user-cookies/get",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("i dati ottenuti sono a forma di ResponseAPI: ", responseData);
            const res: ResponseApiProps<tokenProps> = await responseData;
            return res;
        } catch (error: Error | unknown) {
            const msg = error instanceof Error ? error.message : JSON.stringify(error);
            return msg;
        }
    };
    console.log(fullData());

    const getData = async () => {
        try {
            const token = await fullData();
            if (typeof token === "string") return responseApiObj<null>({
                success: false,
                message: "Il token non è presente nei dati ottenuti",
                data: null,
                status: 404,
            });;
            console.log("Vediamo il tipo della mail: ", token.data.email);
            const email = encodeURIComponent(token.data.email);
            const pathUrl = `http://127.0.0.1:8000/api/get-user/${email}`
            const res = await customFetch({
                isPy: true,
                urlPy: pathUrl,
                method: 'get',
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "reload",
            });
            console.log("Questa API invece cosa permette di ottenere? ", res);
            const response: ResponseApiProps<ResponseUserAPIType> = await res;
            if (response.status !== 200) return responseApiObj<null>({
                success: response.success,
                message: response.message,
                data: null,
                status: response.status,
            });
            const dataUser = response.data.data_user ? response.data.data_user : null;
            const tkUser = dataUser !== null ? dataUser.tk : responseApiObj<null>({
                success: false,
                message: "I dati dell'utente non sono presenti nei dati ottenuti",
                data: null,
                status: 404,
            });
            if (!tkUser) return responseApiObj<null>({
                success: false,
                message: "Il token non è presente nei dati ottenuti",
                data: null,
                status: 404,
            });

            const resInvoice = customFetch({
                isPy: true,
                urlPy: `http://127.0.0.1:8000/api/get-invoice-user/${tkUser}`,
                method: 'get',
                cache: 'reload',
            });
            if (!resInvoice) return responseApiObj<null>({
                success: false,
                message: "Le fatture non sono presenti nei dati ottenuti",
                data: null,
                status: 404,
            });
            const responseInv: ResponseApiProps<invoiceType[]> = await resInvoice;
            console.log("Le fatture sono state recuperate: ", responseInv);
            return responseInv;

        } catch (error: Error | unknown) {
            console.log("Errore presente nella chiamata: ", error instanceof Error ? error.message : error)
            return responseApiObj<null>({
                success: false,
                message: "Le fatture non sono presenti nei dati ottenuti",
                data: null,
                status: 404,
            });
        }
    }

    // 3. Esecuzione controllata della chiamata al mounting del componente
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            const result = await getData();

            if (isMounted) {
                if (result.success && result.data) {
                    setInvoices(result.data);
                } else {
                    setErrorMsg(result.message);
                }
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup per evitare memory leak su unmount
        };
    }, []);

    return (
        <div className="relative flex min-h-full w-96 border border-blue-900">
            {
                invoices.length === 0 ?
                    (
                        <p>Nessun dato presente</p>
                    ) :
                    (
                        <ul className="bg-black relative flex flex-col h-auto w-full border border-white">
                            {
                                invoices.map((el) => {
                                    console.log("I dati sono presenti ", el);
                                    return (
                                        <li key={el.id} className="text-red-500 bg-white w-full">{el.num_invoice}</li>
                                    )
                                })
                            }
                        </ul>
                    )
            }
        </div>
    )
}