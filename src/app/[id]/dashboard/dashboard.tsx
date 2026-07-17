"use client"

import FormComponent from "@/src/ui/form/form";
import { formSchema, formType, ResponseAPISchema } from "@/src/zod/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function DashboardComponent({
    user
}: {
    user: formType | null
}) {
    const router = useRouter();

    const initialState: formType = {
        name: "Mario",
        lastName: "Rossi",
        address: {
            country: "Example",
            city: "Example",
            street: "Example",
            civicNum: "0"
        },
        prePhone: "Example",
        phone: "Example",
        email: "Example",
        pw: "Example",
    };

    const { control, handleSubmit, setValue, reset } = useForm<formType>({
        defaultValues: initialState,
        resolver: zodResolver(formSchema),
    });

    const handleSubmitForm = async (data: formType) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/change-user", {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                cache: "reload"
            });
            if (response.status === 200) {
                const res = await response.json();
                const parsed = await ResponseAPISchema.parseAsync(res);
                if (!parsed) {
                    console.log("La forma della response non è adatta allo schema Zod");
                    return;
                }
                return res;
            }
            if (response.status === 409) {
                console.log("utente già presente nel database");
                return;
            }

        } catch (error: Error | unknown) {
            const err = error instanceof Error ? error.message : error;
            console.log("Errore nella chiamata API, ", err);
            return err;
        }
    }

    const handleDelete = async (email: formType["email"]) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete-user?email=${encodeURIComponent(email)}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(email),
                cache: "no-cache"
            });
            if (response.status === 200) {
                const res = await response.json();
                if (!res) {
                    console.log("La forma della response non è adatta allo schema Zod");
                    return;
                }
                reset(initialState);
                router.push("/");
                return initialState;
            }
            console.log("L'API non è andata a buon fine?: ", response.json());
        } catch (error: Error | unknown) {
            const err = error instanceof Error ? error.message : error;
            console.log("Errore nella chiamata API, ", err);
            return err;
        }
    }

    return (
        <div className="relative flex flex-1">
            {
                !user ? (
                    <p>Utente non trovato</p>
                ) : (
                    <FormComponent
                        user={user}
                        control={control}
                        reset={reset}
                        handleSubmit={handleSubmit}
                        handleSubmitForm={handleSubmitForm}
                        setValue={setValue}
                        isDisabledPw={true}
                    >
                        <>
                            <button className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/3 rounded-2xl min-w-28 cursor-pointer">Salva modifiche</button>
                            <button type="button" className="relative flex items-center justify-center border-2 border-red-500 h-10 w-1/3 rounded-2xl min-w-28 cursor-pointer" onClick={() => handleDelete(user.email)}>Cancella utente</button>
                        </>
                    </FormComponent>
                )
            }
        </div>
    )
};