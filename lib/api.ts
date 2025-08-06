// lib/api.ts

type QueryParams = Record<string, string | number | boolean>;

/**
 * Builds a full URL with query parameters appended.
 * @param url - The base URL (e.g., /api/users)
 * @param queryParams - Optional key-value pairs for query params
 * @returns A string URL with query parameters (e.g., /api/users?active=true)
 */
function buildUrl(url: string, queryParams?: QueryParams): string {
    if (!queryParams) return url;
    const query = new URLSearchParams(
        queryParams as Record<string, string>
    ).toString();
    return `${url}?${query}`;
}

/**
 * Handles the fetch response by parsing JSON and throwing errors if not OK.
 * @param res - The fetch Response object
 * @returns Parsed JSON data of generic type T
 * @throws Error if response is not OK
 */
async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`[${res.status}] ${errorText}`);
    }
    return res.json() as Promise<T>;
}

/**
 * Fetches data from the given URL using GET method.
 * @param url - The API endpoint
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type T
 */
export async function getData<T>(
    url: string,
    queryParams?: QueryParams
): Promise<T> {
    const fullUrl = buildUrl(url, queryParams);
    const res = await fetch(fullUrl);
    return handleResponse<T>(res);
}

/**
 * Sends a POST request with a JSON body.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function postData<TResponse, TBody extends object>(
    url: string,
    data: TBody,
    queryParams?: QueryParams
): Promise<TResponse> {
    const fullUrl = buildUrl(url, queryParams);
    const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<TResponse>(res);
}

/**
 * Sends a PUT request to update an existing resource.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function putData<TResponse, TBody extends object>(
    url: string,
    data: TBody,
    queryParams?: QueryParams
): Promise<TResponse> {
    const fullUrl = buildUrl(url, queryParams);
    const res = await fetch(fullUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<TResponse>(res);
}

/**
 * Sends a PATCH request to partially update an existing resource.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function patchData<TResponse, TBody extends object>(
    url: string,
    data: TBody,
    queryParams?: QueryParams
): Promise<TResponse> {
    const fullUrl = buildUrl(url, queryParams);
    const res = await fetch(fullUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<TResponse>(res);
}

/**
 * Sends a DELETE request to remove a resource.
 * @param url - The API endpoint
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse (e.g., status or message)
 */
export async function deleteData<TResponse>(
    url: string,
    queryParams?: QueryParams
): Promise<TResponse> {
    const fullUrl = buildUrl(url, queryParams);
    const res = await fetch(fullUrl, {
        method: "DELETE",
    });
    return handleResponse<TResponse>(res);
}
