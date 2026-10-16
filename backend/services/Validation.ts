import type {
  IArrayRequirements,
  IDateRequirements,
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
    object: (toValidate: Record<string, unknown>, requirements: IObjectRequirements) => ReqValid.validateObject(toValidate, requirements),
    date: (toValidate: string, requirements: IDateRequirements) => ReqValid.validateDate(toValidate, requirements)
  };
  static validateObject(toValidate: Record<string, unknown>, requirements: IObjectRequirements) {
    if (typeof toValidate !== 'object' || toValidate === null) return false;
    if (Object.keys(requirements).length !== 0) {
      for (const requirementKey in requirements) {
        const requirement = requirements[requirementKey];
        if (!requirement) return false;
        let passed = false;
        switch (requirement.type) {
          case 'number': passed = ReqValid.validationMethods.number(toValidate[requirementKey] as number, requirement.requirements); break;
          case 'string': passed = ReqValid.validationMethods.string(toValidate[requirementKey] as string, requirement.requirements); break;
          case 'array': passed = ReqValid.validationMethods.array(toValidate[requirementKey] as any[], requirement.requirements); break;
          case 'object': passed = ReqValid.validationMethods.object(toValidate[requirementKey] as Record<string, unknown>, requirement.requirements); break;
          case 'date': passed = ReqValid.validationMethods.date(toValidate[requirementKey] as string, requirement.requirements); break;
          default: return false;
        }
        if (!passed) {
          console.error(`[ReqValid] Validation Error: ${requirementKey} failed!`);
          return false;
        };
      }
    }

    return true;
  }
  static validateNumber(toValidate: number, requirements: INumberRequirements): boolean {
    if (toValidate == null) return requirements.canBeNull === true;
    if (typeof toValidate !== 'number') return false;
    if (isNaN(toValidate)) return false;
    if (requirements.min !== undefined && toValidate < requirements.min) return false;
    if (requirements.max !== undefined && toValidate > requirements.max) return false;

    return true;
  }
  static validateString(toValidate: string, requirements: IStringRequirements): boolean {
    if (toValidate == null) return requirements.canBeNull === true;
    if (typeof toValidate !== 'string') return false;

    if (requirements.trimmed) {
      toValidate = toValidate.trim();
    }
    if (requirements.expectedValues && !requirements.expectedValues.includes(toValidate)) return false;
    if (requirements.minLength !== undefined && toValidate.length < requirements.minLength) return false;
    if (requirements.maxLength !== undefined && toValidate.length > requirements.maxLength) return false;
    if (requirements.maxBytes && Buffer.byteLength(toValidate, 'utf8') > requirements.maxBytes) return false
    if (requirements.regex) return requirements.regex.test(toValidate);

    return true;
  }
  static validateArray(toValidate: any[], requirements: IArrayRequirements): boolean {
    if (toValidate == null) return requirements.canBeNull === true;
    if (!Array.isArray(toValidate)) return false;
    if (requirements.minElements !== undefined && toValidate.length < requirements.minElements) return false;
    if (requirements.maxElements !== undefined && toValidate.length > requirements.maxElements) return false;
    return true;
  }
  static validateDate(toValidate: string, requirements: IDateRequirements): boolean {
    if (toValidate == null) return requirements.canBeNull === true;
    if (typeof toValidate !== 'string') return false;
    if (toValidate.trim().length === 0) return false
    const providedDate: Date = new Date(toValidate);

    if (isNaN(providedDate.getTime())) return false;
    const currentDate: Date = new Date();

    let age: number = currentDate.getUTCFullYear() - providedDate.getUTCFullYear();
    if (currentDate.getUTCMonth() < providedDate.getUTCMonth() || (currentDate.getUTCMonth() === providedDate.getUTCMonth() && currentDate.getUTCDate() < providedDate.getUTCDate())) {
      age--;
    }
    return age >= requirements.minAge && age <= requirements.maxAge;
  }
}
