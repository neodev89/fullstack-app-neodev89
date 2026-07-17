import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface saveCookiesProps {
    email: string;
}

const firmToken = process.env.FIRM_TOKEN ?? "";

export async function setUserCookies({
    email
}: saveCookiesProps) {
    try {
        const cookieStore = cookies();
        const firmSetCookies = process.env.KEY_COOKIES_SET;
        if (!firmSetCookies) return false;

        const token = jwt.sign(
            email,
            firmToken,
            {
                expiresIn: 24 * 60 * 60
            }
        );

        (await cookieStore).set(
            firmSetCookies,
            token,
            {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                expires: 24 * 60 * 60,
            }
        );

        return true;
    }
    catch (error: Error | unknown) {
        console.log("Errore nel set cookies: ", error instanceof Error ? error.message : error);
        return false;
    }
};

export async function getUserCookies(): Promise<string> {
    try {
        const cookieStore = await cookies();
        const firmSetCookies = process.env.KEY_COOKIES_SET;
        if (!firmSetCookies) return "";

        const userCookies = cookieStore.get(firmSetCookies)?.value;
        if (!userCookies) return "";
        return userCookies as string;
    } catch (error: Error | unknown) {
        return error instanceof Error ? error.message : "";
    }
};