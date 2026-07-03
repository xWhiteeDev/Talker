export interface IRegister {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthdayDate: string;
}

export interface IRegisterConfig {
    password: { min: number, max: number },
    personalDataRegex: RegExp,
    personalData: { min: number, max: number },
    email: { min: number, max: number },
    minimalUsageAge: number
}


export interface IConfigLength {
    min: number;
    max: number;
}

export interface IConfig {
    length?: IConfigLength;
    trim?: boolean;
    regex?: RegExp;
}

export interface IGlobalConfig {
    [key: string]: IConfig
}



export type LengthFunction = (value: string, rules: IConfigLength) => boolean;
export type TrimFunction = (value: string, rules: boolean) => boolean;
rxport type RegexFunction = (value: string, rules: RegExp) => boolean;

export interface IValidators {
    trim: TrimFunction;
    length: LengthFunction;
    regex: RegexFunction;
}

export interface ILogin {
    email:string;
    password:string
}