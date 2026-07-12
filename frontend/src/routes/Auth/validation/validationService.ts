import type { GlobalConfiguration, ValidationFunctions, Configuration } from "./types";


export function validate(toValidate: Record<string, unknown>, config: GlobalConfiguration, validators: ValidationFunctions
): boolean {
    let isValid = true

    for (const property in toValidate) {
        if (!config[property]) continue;
        const validationPropertyRequirements: Configuration = config[property];
        let configurationProperty: keyof Configuration
        for (configurationProperty in validationPropertyRequirements) {
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

