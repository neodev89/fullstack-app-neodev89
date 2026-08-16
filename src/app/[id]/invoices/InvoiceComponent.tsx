'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { tokenProps } from "@/src/interfaces/tokenProps";
import { customFetch } from "@/src/lib/fetch/customFetch";
import { responseApiObj, ResponseApiProps } from "@/src/responseAPI/responseApi";
import { ResponseUserAPIType } from "@/src/zod/formSchema";
import { invoiceType } from "@/src/zod/invoiceSchema";
import { usePathname } from "next/navigation";
import InvoiceModal from "./invoiceModal";

export default function InvoiceComponent() {

    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<invoiceType[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [itemInvoice, setItemInvoice] = useState<invoiceType | null>(null);
    const pathname = usePathname();

    const backPath = pathname.split("/");
    const user = backPath[1];
    const route = backPath[2];
    const newPath = route.replace(route, `${user}/dashboard`);
    console.log("pathname splittato", newPath);

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

    const getData = async (options?: { signal?: AbortSignal }) => {
        const signal = options?.signal;

        try {
            const token = await fullData();
            if (typeof token === "string") {
                return responseApiObj<null>({
                    success: false,
                    message: "Il token non è presente nei dati ottenuti",
                    data: null,
                    status: 404,
                });
            }

            console.log("Vediamo il tipo della mail: ", token.data.email);
            const email = encodeURIComponent(token.data.email);
            const pathUrl = `http://127.0.0.1:8000/api/get-user/${email}`;

            // Prima chiamata con signal
            const res = await customFetch({
                isPy: true,
                urlPy: pathUrl,
                method: 'get',
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "reload",
                signal,
            });

            const response: ResponseApiProps<ResponseUserAPIType> = res;

            if (response.status !== 200) {
                return responseApiObj<null>({
                    success: response.success,
                    message: response.message,
                    data: null,
                    status: response.status,
                });
            }

            const dataUser = response.data?.data_user ?? null;

            // Gestione pulita e sicura di tkUser
            if (!dataUser || !dataUser.tk) {
                return responseApiObj<null>({
                    success: false,
                    message: "I dati o il token dell'utente non sono presenti nei dati ottenuti",
                    data: null,
                    status: 404,
                });
            }

            const tkUser = dataUser.tk;

            // Seconda chiamata: AGGIUNTO signal QUI
            const resInvoice = await customFetch({
                isPy: true,
                urlPy: `http://127.0.0.1:8000/api/get-invoice-user/${tkUser}`,
                method: 'get',
                cache: 'reload',
                signal, // <- FONDAMENTALE!
            });

            if (!resInvoice) {
                return responseApiObj<null>({
                    success: false,
                    message: "Le fatture non sono presenti nei dati ottenuti",
                    data: null,
                    status: 404,
                });
            }

            const responseInv: ResponseApiProps<invoiceType[]> = resInvoice;
            console.log("Le fatture sono state recuperate: ", responseInv);
            return responseInv;

        } catch (error: unknown) {
            // Se l'errore è dovuto all'abort, LO RILANCIAMO
            // in modo che il try/catch del useEffect possa ignorarlo senza fare setState
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }

            console.log("Errore presente nella chiamata: ", error instanceof Error ? error.message : error);
            return responseApiObj<null>({
                success: false,
                message: "Errore durante il recupero delle fatture",
                data: null,
                status: 500,
            });
        }
    };

    // 3. Esecuzione controllata della chiamata al mounting del componente
    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            try {
                // TypeScript riconosce la firma ed è felice
                const result = await getData({ signal: controller.signal });

                // L'inferenza sul discriminated union funziona nativamente
                if (result.success && result.data) {
                    setInvoices(result.data); // result.data qui è Invoice[]
                } else {
                    setErrorMsg(result.message);
                }
            } catch (err: unknown) {
                // In caso di unmount, l'errore è un AbortError e lo ignoriamo
                if (err instanceof Error && err.name !== 'AbortError') {
                    setErrorMsg(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort(); // Interrompe la fetch se il componente si smonta
        };
    }, []);

    return (
        <div className="relative flex flex-col min-h-full w-96 border border-blue-900">
            {
                loading ?
                    (
                        <p className="flex h-24 w-full bg-white text-red-600">Caricamento dati...</p>
                    ) :
                    (
                        <>
                            {
                                invoices.length === 0 ? (
                                    <p className="flex h-24 w-full bg-white text-red-600">Nessun dato presente</p>
                                ) : (
                                    <ul className="bg-black relative flex flex-col h-auto w-full border border-white">
                                        {
                                            invoices.map((el) => {
                                                console.log("I dati sono presenti ", el);
                                                return (
                                                    <button key={el.id} type="button"
                                                        className="text-red-900 underline cursor-pointer"
                                                        onClick={() => {
                                                            setOpenModal(true);
                                                            setItemInvoice(el);
                                                        }}>
                                                        {el.num_invoice}
                                                    </button>
                                                )
                                            })
                                        }
                                    </ul>
                                )
                            }
                        </>
                    )
            }
            <div className="relative flex flex-row justify-center items-center h-36 w-36 border border-black">
                <Link href={`/${newPath}`} className="rounded-2xl border border-red-500 text-center h-12 w-auto min-w-24">
                    Dashboard
                </Link>
            </div>
            {openModal && itemInvoice && (
                <InvoiceModal value={itemInvoice} setItemInvoice={setItemInvoice} openModal={openModal} setOpenModal={setOpenModal} />
            )}
        </div >
    )
}