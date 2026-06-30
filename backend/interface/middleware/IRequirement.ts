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