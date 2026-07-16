import express, {type Request, type Response} from "express";
import {authController} from "../../loader/dependencyLoader.js";
import {isDataValid, isRefreshTokenValid, isAccessTokenActive} from "../../middleware/middleware.js";
import type {IRequirementOptions} from "../../middleware/types.js";

export const authRouter = express.Router();

const registerCfg: Record<string, IRequirementOptions> = {
    email: {
        minLength: 5,
        maxLength: 35,
        type: "string",
        isRequired: true,
        trimmed: true
    },
    password: {
        minLength: 5,
        maxLength: 200,
        type: "string",
        isRequired: true,
        trimmed: true
    },
    firstName: {
        minLength: 3,
        maxLength: 15,
        type: "string",
        isRequired: true,
        trimmed: true
    },
    lastName: {
        minLength: 3,
        maxLength: 15,
        type: "string",
        isRequired: true,
        trimmed: true
    },
    birthdayDate: {
        minLength: 3,
        maxLength: 32,
        type: "string",
        isRequired: true,
        trimmed: true
    }
};

const loginCfg: Record<string, IRequirementOptions> = {
    email: {
        minLength: 5,
        maxLength: 35,
        type: "string",
        isRequired: true,
        trimmed: true
    },
    password: {
        minLength: 5,
        maxLength: 200,
        type: "string",
        isRequired: true,
        trimmed: true
    },
};
authRouter.post('/register', isDataValid(registerCfg), async (req, res, next) => {
    await authController.createUser(req, res, next);
});

authRouter.post('/login', isDataValid(loginCfg), async (req, res, next) => {
    await authController.signIn(req, res, next);
});
authRouter.post('/refresh', isRefreshTokenValid(), async (req, res, next) => {
    authController.refreshToken(req, res, next);
});
authRouter.get('/isAuth', isAccessTokenActive(), (req: Request, res, next) => {
    res.status(200).json({success: true, data: {user: req.currentUser}});
});