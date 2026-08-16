'use server'

import DashboardComponent from "./dashboard";
import { ResponseApiProps } from "@/src/responseAPI/responseApi";
import { formType, ResponseAPISchema, formSchema } from "@/src/zod/formSchema";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const getUser = async (email: string): Promise<formType | null> => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/get-user/${email}`, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "reload",
            })
            const awaitData = await res.json();
            const parsed = await ResponseAPISchema.parseAsync(awaitData);
            if (!parsed) return null;
            const user = await formSchema.parseAsync(parsed.data.data_user)
            if (!user) return null;
            return user;
        } catch (error: Error | unknown) {
            console.log(error instanceof Error ? error.message : error);
            return null;
        }
    };

    const userEmail = async () => {
        try {
            const cookieStore = await cookies(); // Leggi i cookie del client

            const res = await fetch("http://localhost:3000/api/user-cookies/get", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieStore.toString(), // <-- FONDAMENTALE: Inoltra i cookie al Route Handler
                },
                cache: 'no-store' // Evita che Next.js salvi in cache la risposta per utenti diversi
            });

            if (!res.ok) return undefined;
            const response = await res.json();
            const parsed = response as ResponseApiProps<{ email: string, token: string, iat: number, exp: number }>;

            return parsed.data; // <-- FONDAMENTALE: ricordati il return dell'email!
        } catch (error) {
            console.log("Errore nella GET: ", error instanceof Error ? error.message : error);
            return undefined;
        }
    }
    const userData = await userEmail();
    console.log("I dati del cookie sono presenti? ", userData ? userData : "Nessun dato disponibile");
    let userDashboard;
    if (userData && userData.email) {
        console.log("Viene mostrata la email? ", userData.email);
        userDashboard = await getUser(userData.email);
    }
    console.log("Nessuna email presente")

    return (
        <div className="relative flex flex-1 justify-center items-center bg-black">
            {
                !userDashboard ? (
                    <DashboardComponent user={null} />
                ) : (
                    <DashboardComponent user={userDashboard} />
                )
            }
        </div>
    )
}