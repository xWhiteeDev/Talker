export interface IRegisterInfo {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthdayDate: string;
}

export interface IRegisterFormData {
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