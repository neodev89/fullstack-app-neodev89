export const dynamic = "auto";

import { responseApiObj } from "@/src/responseAPI/responseApi";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


const firmToken = process.env.FIRM_TOKEN;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const firmSetCookies = process.env.KEY_COOKIES_SET;
        if (!firmSetCookies) return Response.json(
            responseApiObj<undefined>({
                success: false,
                message: "Il valore è vuoto o non conforme",
                data: undefined,
                status: 404,
            }), { status: 404 }
        );
        if (!firmToken) return Response.json(
            responseApiObj<undefined>({
                success: false,
                message: "Il valore è vuoto o non conforme",
                data: undefined,
                status: 404,
            }), { status: 404 }
        )

        const email = await req.json();
        const strEmail = String(email);

        const token = jwt.sign(
            { email: strEmail },
            firmToken,
            {
                expiresIn: '1d'
            }
        );

        cookieStore.set(
            firmSetCookies,
            token,
            {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60,
            }
        );

        return Response.json(
            responseApiObj<string>({
                success: true,
                message: "Cookies correttamente impostati",
                data: strEmail,
                status: 200,
            }), { status: 200 }
        );
    }
    catch (error: Error | unknown) {
        console.log("Errore nel set cookies: ", error instanceof Error ? error.message : error);
        return Response.json(
            responseApiObj<null>({
                success: false,
                message: "Errore nella chiamata API",
                data: null,
                status: 500,
            }), { status: 500 }
        );
    }
};