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
    trim?: boolean;
    minimalUsageAge?:number
}

export interface ILogin {
    email: string;
    password: string
}

export type TransmitionResult = TransmitionFault | TransmitionSuccess

type TransmitionFault = { success: false, message: string }
type TransmitionSuccess = { success: true, data: Record<string,unknown> }