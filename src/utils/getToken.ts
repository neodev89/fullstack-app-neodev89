import { ResponseApiProps } from "../responseAPI/responseApi";

export async function getToken() {
    try {
        const responseData = await fetch("http://localhost:3000/api/user-cookies/get", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!responseData.ok) {
            console.log("Dove sono i dati? ", responseData);
            return `${responseData.status} is not worked`;
        }
        const response = await responseData.json();
        return response as ResponseApiProps<{ email: string, token: string, iat: number, exp: number }>;
    } catch (error: Error | unknown) {
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        return msg;
    }
}