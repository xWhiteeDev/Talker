import type {ReactionUnion} from "../components/features/Post/types";

export type EmitMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type EmitData = Record<string, unknown> | [];
export type EmitResult<T> = {success: false, code: number, message?: string;} | {success: true, data?: T;};
