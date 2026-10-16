export type TValidationType = 'string' | 'number' | 'object' | 'array' | 'date';

export type TRequirementsMap = {
  string: IStringRequirements;
  number: INumberRequirements;
  array: IArrayRequirements;
  object: IObjectRequirements;
  date:IDateRequirements
};

export type TValueMap = {
  string: string;
  number: number;
  array: any[];
  object: Record<string, unknown>;
  date:string;
};

export type TRequirements = {
  [K in TValidationType]: {
    type: K;
    requirements: TRequirementsMap[K];
  };
}[TValidationType];

export type TValidationHandler = {
  [K in TValidationType]: (toValidate: TValueMap[K], requirement: TRequirementsMap[K]) => boolean;
};

export interface INumberRequirements {
  min?: number;
  max?: number;
  canBeNull?: boolean;
}
export interface IStringRequirements {
  minLength?: number;
  maxLength?: number;
  trimmed?: boolean;
  expectedValues?: string[];
  regex?: RegExp;
  canBeNull?: boolean;
  maxBytes?:number
}
export interface IArrayRequirements {
  minElements?: number;
  maxElements?: number;
  canBeNull?: boolean;
}

export interface IDateRequirements {
  minAge:number;
  maxAge:number;
  canBeNull?:boolean
}
export interface IObjectRequirements {
  [key: string]: TRequirements;
}
