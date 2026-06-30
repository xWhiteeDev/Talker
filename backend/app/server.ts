import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import dotEnv from 'dotenv'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import { authRouter } from '../routes/authRoute.js';
dotEnv.config();
const cfg = {
    serverPort: process.env['TALKER_SERVER_PORT'] ?? 3000,
    connectionMessage: process.env['TALKER_SERVER_CONNECTION_SUCCEED'] ?? '✨ Connection established✨',
    connectionFaultMessage: process.env['TALKER_SERVER_CONNECTION_FAULT'] ?? '❌ Something went wrong with server connection ❌'
}

function globalMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.status(400).json({ message: err.message })
}

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())
app.use(cookieparser())
app.use('/api/auth', authRouter)
app.use(globalMiddleware)


app.listen(cfg.serverPort, (err) => {
    if (err) {
        console.log(cfg.connectionFaultMessage);
        console.error(err)
        return;
    }
    console.log(cfg.connectionMessage)
})

