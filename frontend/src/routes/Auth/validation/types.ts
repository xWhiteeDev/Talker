export interface ConfigurationLength {
    min: number;
    max: number;
}

export interface Configuration {
    length?: ConfigurationLength;
    trim?: boolean;
    regex?: RegExp;
    minimalAge?: number

}

export interface GlobalConfiguration {
    [key: string]: Configuration
}


export type LengthFunction = (value: string, rules: ConfigurationLength) => boolean;
export type TrimFunction = (value: string, rules: boolean) => boolean;
export type RegexFunction = (value: string, rules: RegExp) => boolean;
export type MinimalAgeFunction = (date: string, rules: number) => boolean
export interface ValidationFunctions {
    trim: TrimFunction;
    length: LengthFunction;
    regex: RegexFunction;
    minimalAge: MinimalAgeFunction
}