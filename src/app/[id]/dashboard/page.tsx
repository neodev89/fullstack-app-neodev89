'use server'

import DashboardComponent from "./dashboard";
import { customFetch } from "@/src/lib/fetch/customFetch";
import { ResponseAPISchemaDB, type DatabaseType, DatabaseSchema, ResponseAPIResCookiesSchema, responseCookiesDecodedSchema } from "@/src/zod/formSchema";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const getUser = async (email: string): Promise<DatabaseType | null> => {
        try {
            const res = await customFetch({
                isPy: true,
                urlPy: `api/get-user/${email}`,
                method: 'get',
                cache: "reload",
            });
            const parsed = await ResponseAPISchemaDB.parseAsync(res);
            if (!parsed) return null;
            const user = await DatabaseSchema.parseAsync(parsed.data.data_user)
            if (!user) return null;
            console.log("L'utente viene recuperato?: ", user);
            return user;
        } catch (error: Error | unknown) {
            console.log(error instanceof Error ? error.message : error);
            return null;
        }
    };

    const userEmail = async () => {
        try {
        const firmSetCookies = process.env.KEY_COOKIES_SET;
            if (!firmSetCookies) return;
            const cookieStore = await cookies(); // Leggi i cookie del client
            const token = cookieStore.get(firmSetCookies);
            if (!token) return;
            const res = await customFetch({
                isPy: false,
                url: "user-cookies/get",
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `${token.name}=${token.value}`, // <-- Formattazione Cookie corretta
                },
                cache: 'no-store'
            });

            if (!res) return undefined;

            return res;
        } catch (error) {
            console.log("Errore nella GET: ", error instanceof Error ? error.message : error);
            return undefined;
        }
    }
    const userData = await userEmail();
    console.log("I dati del cookie sono presenti? ", userData);
    let userDashboard;
    if (userData) {
        const parsed = await ResponseAPIResCookiesSchema.parseAsync(userData);
        if (!parsed) return null;
        userDashboard = await getUser(parsed.data.email);
    }

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