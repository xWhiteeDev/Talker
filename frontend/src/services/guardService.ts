


export function isKeyValid<T>(key: string, allowed: (keyof T & string)[]): key is keyof T & string {
    return allowed.includes(key as keyof T & string)
};

export function isUrlValid(endpoint: string): boolean {

    try {
        new URL(endpoint).origin
        return true
    } catch (error) {
        return false
    }
}

