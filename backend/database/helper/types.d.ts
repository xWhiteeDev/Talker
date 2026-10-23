import {PoolConnection} from 'mysql2/promise';
export interface ITransactionRunner {
    run(work: (reservedPool: PoolConnection) => Promise<T>): Promise<T>;
}