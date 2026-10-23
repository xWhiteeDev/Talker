import {PoolConnection, type Pool} from "mysql2/promise";
import type {ITransactionRunner} from "./types.js";

export type TExecutor = Pool | PoolConnection;
export class TransactionRunner implements ITransactionRunner {
    constructor(private pool: Pool) {

    }
    async run<T>(work: (reservedPool: PoolConnection) => Promise<T>): Promise<T> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await work(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}