export type TAPIMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface IEmitResponse {
    status: number;
    message: string;
}