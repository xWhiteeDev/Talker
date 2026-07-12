import type { JwtPayload } from "jsonwebtoken";

export interface IRequirement {
    [key: string]: IRequirementOptions
}

export interface IRequirementOptions {
    minLength: number;
    maxLength: number;
    type: AllowedRequirementType;
    isRequired:boolean;
    trimmed?:boolean
}


type AllowedRequirementType = 'string' | 'number' | 'array' | 'object'

export interface DecodedPayload extends JwtPayload {
    id:number;
    tokenType:string;
}