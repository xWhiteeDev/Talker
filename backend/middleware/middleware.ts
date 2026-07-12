import type {NextFunction, Request, Response} from "express";
import type {DecodedPayload, IRequirement} from "../interface/middleware/types.js";
import jwt from 'jsonwebtoken';
import {configDotenv} from "dotenv";
import {ErrorHandler} from "../handlers/errorHandler.js";


configDotenv();
export function isDataValid(requirements: IRequirement) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body.data;
            if (!data) {
                throw Error('No data provided');
            }
            for (const requirement in requirements) {
                if (!requirements[requirement]) continue;
                const isRequired = requirements[requirement].isRequired;
                if (!data[requirement] && isRequired) {
                    throw new Error(`Missing property in provided data! ${requirement}`);
                }
                if (!data[requirement] && !isRequired) {
                    console.warn(`Requirement is not present but not required ${requirement}`);
                    continue;
                }
                const requiredElement = requirements[requirement];
                const passedElement = data[requirement];
                if (requiredElement.type === 'array' && !Array.isArray(passedElement)) {
                    throw new Error(`Property: ${requirement} do not satisfy Array type.`);
                }
                if (typeof passedElement !== requiredElement.type && requiredElement.type !== 'array') {
                    throw new Error(`Property: ${requirement} do not satisfy type: ${requiredElement.type}`);
                }
                if (requiredElement.type === 'object' && (Object.keys(passedElement).length > requiredElement.maxLength || Object.keys(passedElement).length < requiredElement.minLength)) {
                    throw new Error(`Property: ${requirement} do not satisfy length requirements!`);
                }
                if (requiredElement.type === 'array' && (passedElement.length > requiredElement.maxLength || passedElement.length < requiredElement.minLength)) {
                    throw new Error(`Property: ${requirement} do not satisfy length requirements!`);
                }
                if (requiredElement.type !== 'array' && requiredElement.type !== 'object') {
                    if (requiredElement.trimmed) {
                        let value: string;
                        if (typeof passedElement === 'number') {
                            value = String(passedElement);
                        } else {
                            value = passedElement;
                        }
                        const correctValue = value.trim();
                        if (correctValue.length > requiredElement.maxLength || correctValue.length < requiredElement.minLength) {
                            throw new Error(`Property: ${requirement} do not satisfy length requirements!`);
                        }
                    }
                }
            }
            next();
        } catch (error) {
            next(error);

        }


    };
}


export function isRefreshTokenValid() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken: string | undefined = req.cookies["refreshToken"];
        if (!refreshToken) {
            throw new ErrorHandler('Unauthorised', 401, true);
        }
        const decoded = jwt.verify(refreshToken, process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!) as DecodedPayload;
        if (decoded['tokenType'] !== 'refresh') {
            throw new ErrorHandler('Unauthorised', 401, true);
        }
        req.currentUser = {id: decoded.id};
        next();
    };
}

export function isAccessTokenActive() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken: string = req.cookies['accessToken'];
        if (!accessToken) {
            throw new ErrorHandler('Unauthorised', 401, true);
        }
        const decoded = jwt.verify(accessToken, process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!) as DecodedPayload;
        if (decoded['tokenType'] !== 'access') {
            throw new ErrorHandler('Wrong token', 400, true);
        }
        req.currentUser = {id: decoded.id};
        next();
    };
}