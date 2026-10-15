import type {IEmitResponse, TAPIMethod} from "../../types/lib/types";
import {EmitError} from "../Error/EmitError";



async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body: unknown = await res.json();
        if (typeof body === 'string') return body;
        if (typeof body === 'object' && body !== null) {
            const b = body as Record<string, unknown>;
            if (typeof b['error'] === 'string') return b['error'];
            if (typeof b['message'] === 'string') return b['message'];
        }
    } catch { }
    return res.statusText || 'Server error, try again later';
}

async function emitServer<T>(url: string, method: TAPIMethod, data?: unknown): Promise<IEmitResponse<T>> {
    const result = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + url, {
        method,
        credentials: 'include',
        headers: data !== undefined ? {'Content-Type': 'application/json'} : undefined,
        body: data !== undefined ? JSON.stringify(data) : undefined,
    }); 

    if (!result.ok) {
        throw new EmitError(result.status, await readErrorMessage(result));
    }

    return (await result.json()) as IEmitResponse<T>;
}
export default emitServer;