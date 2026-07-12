import type { GlobalConfiguration } from "../validation/types";

export const registerValidationConfig: GlobalConfiguration = {
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
export const loginValidationConfig: GlobalConfiguration = {
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