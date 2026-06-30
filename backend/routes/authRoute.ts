import express from "express";
import { isDataValid } from "../middleware/middleware.js";
import { authController } from "../loader/dependencyLoader.js";
import type { IRequirementOptions } from "../interface/middleware/IRequirement.js";

export const authRouter = express.Router()

const cfg: Record<string, IRequirementOptions> = {
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
}

authRouter.post('/register', isDataValid(cfg), async(req,res,next)=>{
   await authController.createUser(req,res,next)
})