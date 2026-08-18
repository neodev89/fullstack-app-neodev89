export const dynamic = "auto";

import jwt from "jsonwebtoken";
import { responseApiObj } from "@/src/responseAPI/responseApi";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const firmToken = process.env.FIRM_TOKEN;
        const firmSetCookies = process.env.KEY_COOKIES_SET;

        const cookieStore = await cookies();
        if (!firmSetCookies) return Response.json(
            responseApiObj<undefined>({
                success: false,
                message: "la firma non è stata trovata",
                data: undefined,
                status: 404,
            }), { status: 404 }
        );
        if (!firmToken) return Response.json(
            responseApiObj<undefined>({
                success: false,
                message: "la firma non è stata trovata",
                data: undefined,
                status: 404,
            }), { status: 404 }
        );

        const rawToken = cookieStore.get(firmSetCookies);
        if (!rawToken) {
            return Response.json(
                responseApiObj<undefined>({
                    success: false,
                    message: "Il token non possiede alcun valore",
                    data: undefined,
                    status: 404,
                }), { status: 404 }
            );
        }

        const decoded = jwt.verify(rawToken.value, firmToken);
         if (!decoded) return Response.json(
            responseApiObj<undefined>({
                success: false,
                message: "la firma non è stata trovata",
                data: undefined,
                status: 404,
            }), { status: 404 }
        );
        return Response.json(
            responseApiObj({
                success: true,
                message: "Cookies restituito",
                data: decoded,
                status: 200,
            }), { status: 200 }
        );
    } catch (error: Error | unknown) {
        return Response.json(
            responseApiObj<Error | unknown>({
                success: false,
                message: "Errore nella chiamata API",
                data: error instanceof Error ? error.message : error,
                status: 500,
            }), { status: 500 }
        );
    }
};