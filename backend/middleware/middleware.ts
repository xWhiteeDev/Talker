import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { ErrorHandler } from '../handlers/errorHandler.js';
import type { DecodedPayload } from './types.js';
import { ReqValid } from '../services/Validation.js';
import type { IObjectRequirements } from '../services/types.js';

configDotenv();

export function isDataValid(requirements: IObjectRequirements) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req.body.data;
      if (!data) {
        throw new Error('No data provided');
      }
      const isValid = ReqValid.validateObject(data, requirements);
      if (!isValid) {
        new ErrorHandler('Provided data is not valid!', 400);
        return false;
      }
      next();
      return true;
    } catch (error) {
      next(error);
      return false
    }
  };
}

export function isRefreshTokenValid() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const refreshToken: string | undefined = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new ErrorHandler('Unauthorised without refresh token', 401, true);
    }
    const decoded = jwt.verify(refreshToken, process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!) as DecodedPayload;
    if (decoded['tokenType'] !== 'refresh') {
      throw new ErrorHandler('Unauthorised without refresh token', 401, true);
    }
    req.currentUser = { id: decoded.id };
    next();
  };
}

export function isAccessTokenActive() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies['accessToken'];
    if (!accessToken) {
      throw new ErrorHandler('Unauthorised', 401, true);
    }
    const decoded = jwt.verify(accessToken, process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!) as DecodedPayload;
    if (decoded['tokenType'] !== 'access') {
      throw new ErrorHandler('Wrong token', 400, true);
    }
    req.currentUser = { id: decoded.id };
    next();
  };
}
