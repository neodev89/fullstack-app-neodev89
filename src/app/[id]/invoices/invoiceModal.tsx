import { ControlledInput } from "@/src/ui/components/controllerInput";
import { invoiceSchema, invoiceType } from "@/src/zod/invoiceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface modalProps {
    value: invoiceType;
    openModal: boolean;
    setOpenModal: (openModal: boolean) => void;
    setItemInvoice: (item: null) => void;
}

export default function InvoiceModal({
    value, openModal, setOpenModal, setItemInvoice,
}: modalProps) {
    const { control } = useForm<invoiceType>({
        defaultValues: {
            id: 0,
            created_at: new Date(),
            num_invoice: "0",
            taxable: "0",
            vat: "0",
            total: "0",
            creation_date: new Date(),
            protocol_numb: "0",
            tax_id_code: "0",
            invoice_token: "0",
        },
        resolver: zodResolver(invoiceSchema),
    });

    return (
        <dialog open={openModal} className="min-h-full min-w-full bg-white">
            {
                value === null ? (
                    <p>Dati inesistenti</p>
                ) : (
                    <div className="flex h-84 w-full bg-amber-50">
                        <div className="flex flex-wrap h-auto w-full">
                            <ControlledInput
                            name={"id"}
                            control={control}
                            type={typeof value.id === "number" ? "number" : "text"}
                            values={value.id}
                        />
                        <ControlledInput
                            name={"created_at"}
                            control={control}
                            type={value.created_at instanceof Date ? "date" : "text"}
                            values={value.created_at}
                        />
                        <ControlledInput
                            name={"num_invoice"}
                            control={control}
                            type={"text"}
                            values={value.num_invoice}
                        />
                        <ControlledInput
                            name={"taxable"}
                            control={control}
                            type={"text"}
                            values={value.taxable}
                        />
                        <ControlledInput
                            name={"vat"}
                            control={control}
                            type={"text"}
                            values={value.vat || 0}
                        />
                        <ControlledInput
                            name={"total"}
                            control={control}
                            type={"text"}
                            values={value.total}
                        />
                        <ControlledInput
                            name={"creation_date"}
                            control={control}
                            type={value.created_at instanceof Date ? "date" : "text"}
                            values={value.creation_date}
                        />
                        <ControlledInput
                            name={"protocol_numb"}
                            control={control}
                            type={"text"}
                            values={value.protocol_numb}
                        />
                        <ControlledInput
                            name={"tax_id_code"}
                            control={control}
                            type={"text"}
                            values={value.tax_id_code || "0%"}
                        />
                        <ControlledInput
                            name={"invoice_token"}
                            control={control}
                            type={"text"}
                            values={value.invoice_token}
                        />
                        </div>
                        <div>
                            <button type="button" onClick={() => {
                                setOpenModal(false);
                                setItemInvoice(null);
                                }}>
                                Close
                            </button>
                        </div>
                    </div>
                )
            }
        </dialog>
    )
}