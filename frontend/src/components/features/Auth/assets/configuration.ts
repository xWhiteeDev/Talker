import type {IGlobalConfiguration} from "../../../../types/services/IValidator";

export const registerValidationConfig: IGlobalConfiguration = {
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
export const loginValidationConfig: IGlobalConfiguration = {
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