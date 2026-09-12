export type Types = 'string' | 'number' | 'object' | 'array'

export type RequirementsMap = {
    string: IStringRequirements;
    number: INumberRequirements;
    array: IArrayRequirements;
    object: IObjectRequirements
}

export type TValueMap = {
    string: string;
    number: number;
    array: any[];
    object: Record<string, unknown>
}

export type TRequirements = {
    [K in Types]: {
        type: K;
        requirements: RequirementsMap[K]
    }
}[Types]

export type TValidationHandler = {
    [K in Types]: (toValidate: TValueMap[K], requirement: RequirementsMap[K]) => boolean
}

export interface INumberRequirements {
    min: number;
    max: number
}
export interface IStringRequirements {
    minLength: number;
    maxLength: number;
    trimmed?: boolean;
    expectedValues?:string[]
    regex?: RegExp
}
export interface IArrayRequirements {
    minElements: number;
    maxElements: number;
}

export interface IObjectRequirements {
    [key: string]: TRequirements

}