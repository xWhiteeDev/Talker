import type { IGlobalConfig } from "../interfaces/helpers/IValidationHelpers";

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
        regex: /[^\p{L}\p{N}\s]/u,

    },
    email: {
        length: {
            min: 5,
            max: 35
        }
    },
    birthdayDate: {
        minimalAge: 14
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