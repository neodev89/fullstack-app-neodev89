import { responseApiObj } from "@/src/responseAPI/responseApi";
import { cookies } from "next/headers";

export async function DELETE() {
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

        cookieStore.delete(firmSetCookies);
        return Response.json(responseApiObj<string>({
            success: true,
            message: "cookies cancellati",
            data: "Ok",
            status: 200,
        }), { status: 200 });
    } catch (error: Error | unknown) {
        return Response.json(responseApiObj<string>({
            success: false,
            message: "Errore nella chiamata API Delete",
            data: error instanceof Error ? error.message : String(error),
            status: 500,
        }), { status: 500 });
    }
}