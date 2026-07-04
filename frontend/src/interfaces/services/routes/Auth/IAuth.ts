import type {  IGlobalConfig, IValidators } from "../../../helpers/IValidationHelpers";

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
    minimalAge: number
}


export interface ILogin {
    email: string;
    password: string
}


export interface IAuthorization {
    transmisionEndpoint: string;
    successContent?:string;
    navigationPoint: string;
    validationConfiguration:IGlobalConfig;
    validationFunctions:IValidators
}