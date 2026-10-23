export type TAPIMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface IEmitResponse<T> {
    success:boolean
    message?:string;
    data?:T
}
export interface ICurrentUser {
    id:number
}
