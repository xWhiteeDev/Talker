import type { IRegisterConfig } from "../interfaces/services/routes/Auth/IRegister";

export const registerConfig: IRegisterConfig = {
    password: {
        min: 5,
        max: 200
    },
    personalDataRegex: /[^\p{L}\p{N}\s]/u,
    personalData: {
        min: 3,
        max: 15
    },
    email: {
        min: 5,
        max: 15
    },
    minimalUsageAge: 14
}