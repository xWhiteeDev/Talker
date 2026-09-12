import type {
  IArrayRequirements,
  INumberRequirements,
  IObjectRequirements,
  IStringRequirements,
  TValidationHandler,
} from './types.js';

export class ReqValid {
  static validationMethods: TValidationHandler = {
    string: (toValidate: string, requirements: IStringRequirements) => ReqValid.validateString(toValidate, requirements),
    number: (toValidate: number, requirements: INumberRequirements) => ReqValid.validateNumber(toValidate, requirements),
    array: (toValidate: any[], requirements: IArrayRequirements) => ReqValid.validateArray(toValidate, requirements),
    object: (toValidate: Record<string, unknown>, requirements: IObjectRequirements) =>
      ReqValid.validateObject(toValidate, requirements),
  };
  static validateObject(toValidate: Record<string, unknown>, requirements: IObjectRequirements) {
    let passed: boolean = false;
    for (const requirementKey in requirements) {
      const requirement = requirements[requirementKey];
      if (!requirement) {
        console.error('Requirement key missing!');
        return false;
      }
      if (requirement.type === 'number') {
        passed = ReqValid.validationMethods.number(toValidate[requirementKey] as number, requirement.requirements);
      }
      if (requirement.type === 'string') {
        passed = ReqValid.validationMethods.string(toValidate[requirementKey] as string, requirement.requirements);
      }
      if (requirement.type === 'array') {
        passed = ReqValid.validationMethods.array(toValidate[requirementKey] as any[], requirement.requirements);
      }
      if (requirement.type === 'object') {
        passed = ReqValid.validationMethods.object(
          toValidate[requirementKey] as Record<string, unknown>,
          requirement.requirements,
        );
      }
      if (!passed) {
        return false;
      }
    }
    return true;
  }
  static validateNumber(toValidate: number, requirements: INumberRequirements): boolean {
    if (isNaN(toValidate)) {
      return false;
    }
    if (toValidate < requirements.min) {
      console.error(`Validated ${toValidate} is too low`);
      return false;
    }
    if (toValidate > requirements.max) {
      console.error(`Validated ${toValidate} is too high`);
      return false;
    }
    return true;
  }
  static validateString(toValidate: string, requirements: IStringRequirements): boolean {
    if (typeof toValidate !== 'string') {
      console.error('Value is not a string!');
      return false;
    }
    if (requirements.trimmed) {
      toValidate = toValidate.trim();
    }
    if (requirements.expectedValues && !requirements.expectedValues.includes(toValidate)) {
      return false;
    }
    if (requirements.regex) {
      return requirements.regex.test(toValidate);
    }
    if (toValidate.length < requirements.minLength) {
      console.error(`Validated ${toValidate} is too short`);
      return false;
    }
    if (toValidate.length > requirements.maxLength) {
      console.error(`Validated ${toValidate} is too long`);
      return false;
    }
    return true;
  }
  static validateArray(toValidate: any[], requirements: IArrayRequirements) {
    if (!Array.isArray(toValidate)) return false;
    if (toValidate.length < requirements.minElements) return false;
    if (toValidate.length > requirements.maxElements) return false;
    return true;
  }
}
