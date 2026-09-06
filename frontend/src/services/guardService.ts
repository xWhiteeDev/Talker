export function isKeyValid<T>(key: string, allowed: (keyof T & string)[]): key is keyof T & string {
  return allowed.includes(key as keyof T & string);
}

export function isUrlValid(endpoint: string): boolean {
  try {
    const url = new URL(endpoint).origin;
    if (!url) {
      throw new Error('URL is not valid');
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
