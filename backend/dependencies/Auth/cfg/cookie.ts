export const ACCESS_TOKEN = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 5 * 60 * 1000,
} as const;
export const REFRESH_TOKEN = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60000 * 60 * 24 * 7,
} as const