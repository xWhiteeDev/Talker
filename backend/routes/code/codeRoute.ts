import {Router} from "express";
import {codeController} from "../../loader/dependencyLoader.js";
import {verifyConfirmationRequest} from "../../middleware/middleware.js";
import type {IObjectRequirements} from "../../services/types.js";
import {ACCOUNT_CONFIG} from "../../configurations/account.config.js";

export const codeRouter = Router();

const confirmationObjectRequirements: IObjectRequirements = {
    email: {
        type: 'string',
        requirements: {
            minLength: ACCOUNT_CONFIG.EMAIL.MIN,
            maxLength: ACCOUNT_CONFIG.EMAIL.MAX,
            regex: ACCOUNT_CONFIG.EMAIL.REGEX,
            canBeNull: false,
            trimmed: true,
        }
    },
    code: {
        type: 'string',
        requirements: {
            minLength: ACCOUNT_CONFIG.CODE.MIN,
            maxLength: ACCOUNT_CONFIG.CODE.MAX,
            canBeNull: false,
            regex: ACCOUNT_CONFIG.CODE.REGEX
        }
    },

};

const resendCodeObjectRequirements: IObjectRequirements = {
    email: {
        type: 'string',
        requirements: {
            minLength: ACCOUNT_CONFIG.EMAIL.MIN,
            maxLength: ACCOUNT_CONFIG.EMAIL.MAX,
            regex: ACCOUNT_CONFIG.EMAIL.REGEX,
            canBeNull: false,
            trimmed: true
        }
    }
};

codeRouter.post('/resendCode', verifyConfirmationRequest(resendCodeObjectRequirements), async (req, res, next) => {
    await codeController.resendVerificationCode(req, res, next);
});

codeRouter.post('/confirmCode', verifyConfirmationRequest(confirmationObjectRequirements), async (req, res, next) => {
    await codeController.confirmCode(req, res, next);
});