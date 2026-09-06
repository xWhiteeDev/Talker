export interface IConfigurationLength {
  min: number;
  max: number;
}

export interface IConfiguration {
  length?: IConfigurationLength;
  trim?: boolean;
  regex?: RegExp;
  minimalAge?: number;
}

export interface IGlobalConfiguration {
  [key: string]: IConfiguration;
}

export interface IValidationFunctions {
  trim: TTrimFunction;
  length: TTrimFunction;
  regex: TRegexFunction;
  minimalAge: TMinimalAgeFunction;
}

export type TLengthFunction = (value: string, rules: IConfiguration) => boolean;
export type TTrimFunction = (value: string, rules: boolean) => boolean;
export type TRegexFunction = (value: string, rules: RegExp) => boolean;
export type TMinimalAgeFunction = (date: string, rules: number) => boolean;
