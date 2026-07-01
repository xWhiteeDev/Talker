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

export interface IGlobalConfig {
    [key: string]: IConfig
}

interface IConfig {
    length?: {
        min: number;
        max: number
    }
    regexp?: RegExp;
    trim?: boolean
}

export interface ILogin {
    email:string;
    password:string
}