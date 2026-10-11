export const PERSONAL_CONFIG = {
    FIRST_NAME: {
        MIN: 2,
        MAX: 10,
        REGEX: /^\p{L}+(?:['’-]\p{L}+)*$/u
    },
    LAST_NAME: {
        MIN: 2,
        MAX: 15,
        REGEX: /^\p{L}+(?:[ '’-]\p{L}+)*$/u
    },
    BIRTHDAY: {
        MIN_AGE: 16,
        MAX_AGE: 99
    },
    LIVING_PLACE: {
        MIN: 2,
        MAX: 20,
        REGEX: /^\p{L}+\.?(?:[ '’-]\p{L}+\.?)*$/u
    }
} as const;