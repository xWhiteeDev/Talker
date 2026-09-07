import type { IConfiguration, IGlobalConfiguration, IValidationFunctions } from '../types/services/IValidator';

export function validate(
  toValidate: Record<string, unknown>,
  config: IGlobalConfiguration,
  validators: IValidationFunctions,
): boolean {
  let isValid = true;
  const allowedMethods: (keyof IValidationFunctions)[] = ['length', 'minimalAge', 'regex', 'trim'];
  for (const property in toValidate) {
    const validationPropertyRequirements: IConfiguration = config[property];
    let configurationProperty: keyof IConfiguration;
    for (configurationProperty in validationPropertyRequirements) {
      if (!allowedMethods.includes(configurationProperty)) continue;

      const validationMethod = validators[configurationProperty] as (value: string, rules: unknown) => boolean;
      if (typeof toValidate[property] === 'string') {
        const methodResult = validationMethod(toValidate[property], validationPropertyRequirements[configurationProperty]);
        if (!methodResult) {
          isValid = false;
        }
      }
    }
  }
  return isValid;
}
