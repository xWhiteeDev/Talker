import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import dotEnv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { ErrorHandler } from '../handlers/errorHandler.js';
import { authRouter } from '../routes/auth/authRoute.js';
import { postRouter } from '../routes/post/postRoute.js';
import { commentReactionRouter, postReactionRouter } from '../routes/reaction/reactionRoute.js';
import { commmentRouter } from '../routes/comment/commentRoute.js';
import { profileRouter } from '../routes/profile/profileRoute.js';
import { searchRouter } from '../routes/search/searchRoute.js';
import { friendsRouter } from '../routes/friends/friendsRoute.js';
import jwt from 'jsonwebtoken';
dotEnv.config();
const cfg = {
  serverPort: process.env['TALKER_SERVER_PORT'] ?? 3000,
  connectionMessage: process.env['TALKER_SERVER_CONNECTION_SUCCEED'] ?? '✨ Connection established✨',
  connectionFaultMessage: process.env['TALKER_SERVER_CONNECTION_FAULT'] ?? '❌ Something went wrong with server connection ❌',
};

function globalMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ErrorHandler) {
    if (!err.isOperational) {
      res.status(500).json({ success: false, code: 500, message: 'Internal server error' });
    } else {
      res.status(err.code).json({ success: false, code: err.code, message: err.message });
    }
    return;
  }
  if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ success: false, code: 401, message: 'Invalid or expired token' });
    return;
  }
  res.status(500).json({ success: false, code: 500, message: 'Internal server error' });
}

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['POST', 'GET', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Methods'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/postReactions', postReactionRouter);
app.use('/api/comments', commmentRouter);
app.use('/api/commentReactions', commentReactionRouter);
app.use('/api/profile', profileRouter);
app.use('/api/search', searchRouter);
app.use('/api/friends', friendsRouter);

app.use(globalMiddleware);

app.listen(cfg.serverPort, (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
