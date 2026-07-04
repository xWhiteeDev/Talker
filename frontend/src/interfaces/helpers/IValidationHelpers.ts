export interface IConfigLength {
    min: number;
    max: number;
}

export interface IConfig {
    length?: IConfigLength;
    trim?: boolean;
    regex?: RegExp;
    minimalAge?: number

}

export interface IGlobalConfig {
    [key: string]: IConfig
}


export type LengthFunction = (value: string, rules: IConfigLength) => boolean;
export type TrimFunction = (value: string, rules: boolean) => boolean;
export type RegexFunction = (value: string, rules: RegExp) => boolean;
export type MinimalAgeFunction = (date: string, rules: number) => boolean
export interface IValidators {
    trim: TrimFunction;
    length: LengthFunction;
    regex: RegexFunction;
    minimalAge: MinimalAgeFunction
}

export type TransmitionResult = TransmitionFault | TransmitionSuccess

type TransmitionFault = { success: false, message: string }
type TransmitionSuccess = { success: true, data: Record<string, unknown> }

export type TransmitionMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'