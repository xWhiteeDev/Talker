export const PARAMETERS_REQUIREMENTS = {
    PERSONAL: {
        FIRST_NAME: {MIN: 2, MAX: 12},
        LAST_NAME: {MIN: 2, MAX: 12}
    },
    EMAIL: {MIN: 4, MAX: 32},
    PASSWORD: {MIN: 5, MAX: 64},
    CODE:6,
    LIVINGPLACE:{min:4,max:12},
    MIN_AGE:16

} as const;

export const BRUTE_FORCE = {
    MAX_ATTEMPTS:10,
    BRUTE_FORCE_PROTECTION_MAX_TIME:100000
} as const

export const BACKEND_ENDPOINT = 'http://localhost:3000'