import type { IGlobalConfig, IRegisterConfig } from "../interfaces/services/routes/Auth/IAuth";

export const registerValidationConfig: IGlobalConfig = {
    password: {
        length:
        {
            min: 5,
            max: 200
        },
    },
    personalData: {
        length: {
            min: 3,
            max: 15
        },
        regexp: /[^\p{L}\p{N}\s]/u,

    },
    email: {
        length: {
            min: 5,
            max: 35
        }
    },
    birthdayDate: {
        minimalUsageAge: 14
    }
};
export const loginValidationConfig: IGlobalConfig = {
    email: {
        length: {
            min: 5,
            max: 35,
        },
    },
    password: {
        length: {
            min: 5,
            max: 200,
        },
    },
}