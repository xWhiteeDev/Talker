import type { IGlobalConfig, IValidators, IConfig, TransmitionMethodType, TransmitionResult } from "../interfaces/helpers/IValidationHelpers";

export function validate(toValidate: Record<string, unknown>, config: IGlobalConfig, validators: IValidators
): boolean {
    let isValid = true

    for (const property in toValidate) {
        if (!config[property]) continue;
        const validationPropertyRequirements: IConfig = config[property];
        let configurationProperty: keyof IConfig
        for (configurationProperty in validationPropertyRequirements) {
            console.log(configurationProperty,validators[configurationProperty])
            const validationMethod = validators[configurationProperty];
            if (typeof toValidate[property] === 'string') {
                const methodResult = validationMethod(toValidate[property], validationPropertyRequirements[configurationProperty]);
                if (!methodResult) {
                    isValid = false;
                }
            }
        }

    }
    return isValid
}


export function isKeyValid<T>(key: string, allowed: (keyof T & string)[]): key is keyof T & string {
    return allowed.includes(key as keyof T & string)
}

export function isUrlValid(endpoint: string): boolean {
    try {
        new URL(endpoint).origin
        return true
    } catch (error) {
        return false
    }
}

export async function transmitionToServer(endpoint: string, method: TransmitionMethodType, toTransmite: unknown): Promise<TransmitionResult> {

    if (!endpoint) {
        return { success: false, message: "Endpoint not provided" }
    }
    try {
        const res = await fetch(endpoint, {
            method: method, headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ data: toTransmite })
        })
        const data = await res.json()
        if (!res.ok) {
            return { success: false, message: data.message }
        }
        return { success: true, data }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message }
        } else {
            return { success: false, message: 'Unknown error' }
        }
    }

}