import { isUrlValid } from "../../utils/guards"
import { ErrorHandler } from "../customError";
import type { EmitData, EmitMethod } from "./types"



export async function emitServer<T>(url: string, method: EmitMethod, data?: EmitData): Promise<T | null> {
    const fullEndpoint = import.meta.env['VITE_SERVER_ENDPOINT'] + url;
    const isUrlCorrect: boolean = isUrlValid(fullEndpoint);
    if (!isUrlCorrect) {
        throw new ErrorHandler('[emitServer] Provided url is not correct!', 502);
    }
    if (data && !(Array.isArray(data) || typeof data === 'object' && data !== null)) throw new ErrorHandler('[emitServer] Provided data does not meet requirements!', 500)
    const res: Response = await fetch(fullEndpoint, {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: data ? JSON.stringify({ data }) : undefined,
        credentials: 'include'
    })
    if (!res.ok) {
        const responseCode: number = res.status
        try {
            const responseData: { message: string } = await res.json()
            const responseMessage: string = responseData.message
            throw new ErrorHandler(responseMessage, responseCode)
        } catch (error) {
            if (error instanceof ErrorHandler) {
                throw error
            }
            throw new ErrorHandler('Unknown error', responseCode)
        }
    }
    try {
        if (res.status === 204) {
            return null
        }
        const responseData: T = await res.json() as T
        return responseData

    } catch (error) {
        if (error instanceof Error) {
            throw new ErrorHandler(error.message, 500)
        }
        throw new ErrorHandler('Unknown error from server', 500)
    }

}
