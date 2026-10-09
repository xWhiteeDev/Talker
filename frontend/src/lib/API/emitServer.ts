import {BACKEND_ENDPOINT} from "../../cfg";
import type {IEmitResponse, TAPIMethod} from "../../types/lib/types";
import {EmitError} from "../Error/EmitError";

async function emitServer<T>(url: string, method: TAPIMethod, data?: unknown): Promise<IEmitResponse<T>> {
    try {
        const result = await fetch(BACKEND_ENDPOINT + url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!result.ok) {
            const statusCode: number = result.status;
            const statusMessage: string = result.statusText;
            throw new EmitError(statusCode, statusMessage);
        }
        return (await result.json()) as IEmitResponse<T>;
    } catch (error) {
        throw error;
    }


}
export default emitServer;