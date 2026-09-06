import type {IConfiguration, IGlobalConfiguration, IValidationFunctions} from "../types/services/IValidator";


export function validate(toValidate: Record<string, unknown>, config: IGlobalConfiguration, validators: IValidationFunctions
): boolean {
    let isValid = true

    for (const property in toValidate) {
        if (!config[property]) continue;
        const validationPropertyRequirements: IConfiguration = config[property];
        let configurationProperty: keyof IConfiguration
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

