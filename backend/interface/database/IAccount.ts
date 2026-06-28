import type { ResultSetHeader } from "mysql2";

export interface IAccountRow extends ResultSetHeader {
    id: string;
    created_at: string;
    email: string;
    password: string
}