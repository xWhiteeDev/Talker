import type {TValidationHandler, IStringRequirements, INumberRequirements, IArrayRequirements, IObjectRequirements} from './types';


//TODO: DO BETTER VALIDATING | Remember to add it to auth/components/...


export class Validify {
  static validationMethods: TValidationHandler = {
    string: (toValidate: string, requirements: IStringRequirements) => Validify.validateString(toValidate, requirements),
    number: (toValidate: number, requirements: INumberRequirements) => Validify.validateNumber(toValidate, requirements),
    array: (toValidate: unknown[], requirements: IArrayRequirements) => Validify.validateArray(toValidate, requirements),
    object: (toValidate: Record<string, unknown>, requirements: IObjectRequirements) =>
      Validify.validateObject(toValidate, requirements),
  };
  static validateObject(toValidate: Record<string, unknown>, requirements: IObjectRequirements) {
    let passed: boolean = false;
    if (Object.keys(requirements).length !== 0) {
      for (const requirementKey in requirements) {
        const requirement = requirements[requirementKey];
        if (!requirement) {
          console.error('Requirement key missing!');
          return false;
        }
        if (requirement.type === 'number') {
          passed = Validify.validationMethods.number(toValidate[requirementKey] as number, requirement.requirements);
        }
        if (requirement.type === 'string') {
          passed = Validify.validationMethods.string(toValidate[requirementKey] as string, requirement.requirements);
        }
        if (requirement.type === 'array') {
          passed = Validify.validationMethods.array(toValidate[requirementKey] as unknown[], requirement.requirements);
        }
        if (requirement.type === 'object') {
          passed = Validify.validationMethods.object(
            toValidate[requirementKey] as Record<string, unknown>,
            requirement.requirements,
          );
        }
        if (!passed) {
          return false;
        }
      }
    }

    return true;
  }
  static validateNumber(toValidate: number, requirements: INumberRequirements): boolean {
    if (isNaN(toValidate)) {
      return false;
    }
    if (!requirements.canBeNull && toValidate == null) {
      console.error(`Validated ${toValidate} is null but cannot be.`);
      return false;
    }
    if (requirements.min && toValidate < requirements.min) {
      console.error(`Validated ${toValidate} is too low`);
      return false;
    }
    if (requirements.max && toValidate > requirements.max) {
      console.error(`Validated ${toValidate} is too high`);
      return false;
    }
    return true;
  }
  static validateString(toValidate: string, requirements: IStringRequirements): boolean {
    if (typeof toValidate !== 'string' || (!requirements.canBeNull && toValidate == null)) {
      console.error('Value is not a string!');
      return false;
    }
    if (requirements.trimmed) {
      toValidate = toValidate.trim();
    }
    if (requirements.expectedValues && !requirements.expectedValues.includes(toValidate)) {
      return false;
    }

    if (requirements.minLength && toValidate.length < requirements.minLength) {
      console.error(`Validated ${toValidate} is too short`);
      return false;
    }
    if (requirements.maxLength && toValidate.length > requirements.maxLength) {
      console.error(`Validated ${toValidate} is too long`);
      return false;
    }
    if (requirements.regex) {
      return requirements.regex.test(toValidate);
    }
    return true;
  }
  static validateArray(toValidate: unknown[], requirements: IArrayRequirements) {
    if (!Array.isArray(toValidate)) return false;
    if (!requirements.canBeNull && toValidate == null) {
      console.error(`Validated ${toValidate} is null but cannot be.`);
      return false;
    }
    if (requirements.minElements && toValidate.length < requirements.minElements) return false;
    if (requirements.maxElements && toValidate.length > requirements.maxElements) return false;
    return true;
  }
}
