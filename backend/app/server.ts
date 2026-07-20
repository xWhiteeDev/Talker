import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import dotEnv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import {ErrorHandler} from '../handlers/errorHandler.js';
import {authRouter} from '../routes/auth/authRoute.js';
import {postRouter} from '../routes/post/postRoute.js';
import {postReactionRouter} from '../routes/reaction/reactionRoute.js';
dotEnv.config();
const cfg = {
    serverPort: process.env['TALKER_SERVER_PORT'] ?? 3000,
    connectionMessage: process.env['TALKER_SERVER_CONNECTION_SUCCEED'] ?? '✨ Connection established✨',
    connectionFaultMessage: process.env['TALKER_SERVER_CONNECTION_FAULT'] ?? '❌ Something went wrong with server connection ❌'
};

function globalMiddleware(err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
    if (err.name !== 'ErrorHandler') {
        console.error(err);

        res.status(500).json({success: false, code: 500, message: 'Internal server error'});
        return;
    }
    if (!err.isOperational) {
        console.error(err);
        res.status(500).json({success: false, code: 500, message: 'Internal server error'});
        return;
    }
    console.error(err);
    res.status(err.code).json({success: false, code: err.code, message: err.message});
}

const app = express();
app.use(cors({origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true}));
app.use(express.json());
app.use(cookieparser());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/postReactions', postReactionRouter);

app.use(globalMiddleware);


app.listen(cfg.serverPort, (err) => {
    if (err) {
        console.error(err);
        return;
    }
})

