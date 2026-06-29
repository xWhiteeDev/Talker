import type {  RowDataPacket } from "mysql2";

export interface IAccountRow extends RowDataPacket {
    id: string;
    created_at: string;
    email: string;
    password: string
}