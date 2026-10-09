export type TAPIMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface IEmitResponse<T> {
    message:string;
    data:T
}