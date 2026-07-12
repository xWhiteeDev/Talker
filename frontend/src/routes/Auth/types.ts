import type { GlobalConfiguration, ValidationFunctions } from "./validation/types";



export interface AuthorizationInfo {
    transmisionEndpoint: string;
    successContent?:string;
    navigationPoint: string;
    validationConfiguration:GlobalConfiguration;
    validationFunctions:ValidationFunctions
}