interface customFetchProps {
    isPy: boolean;
    method: "get" | "post" | "put" | "delete";
    url?: string | URL;
    urlPy?: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    cache?: RequestCache | undefined;
    signal?: AbortSignal;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const customFetch = async ({ method, isPy, urlPy, url, headers, params, body, cache }: customFetchProps) => {
    try {
        const awaitData = await fetch(
            isPy ? `http://localhost:8000/${urlPy}` : `http://localhost:3000/api/${url}`,
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                ...params,
                body,
                cache,
            }
        );
        if (!awaitData.ok) {
            // console.log("La chiamata API fallisce per un errore. Controllare: ", {
            //     url: isPy ? `http://localhost:8000/${urlPy}` : `http://localhost:3000/api/${url}`,
            //     method,
            //     body,
            // });
            return null;
        };

        const res = await awaitData.json();
        return res;
    } catch (error: Error | unknown) {
        console.log("Errore nella chiamata API: ", error instanceof Error ? error.message : error);
        return null;
    }
}