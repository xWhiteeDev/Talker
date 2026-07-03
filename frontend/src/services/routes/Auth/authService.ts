import type { IRegisterConfig, IRegister, IGlobalConfig, IGlobalConfig,IValidators} from "../../../interfaces/services/routes/Auth/IAuth";
import { ErrorHandler } from "../../customError";
 

export function getPersonAge(birthdayDate: string, today: string): number {
    const [birthYear, birthMonth, birthDay] = birthdayDate.split('-').map(Number);
    const [todayYear, todayMonth, todayDay] = today.split('-').map(Number)
    let personAge = todayYear - birthYear
    const hadBirthdayThisYear: boolean = todayMonth > birthMonth || (birthMonth === todayMonth && todayDay >= birthDay);
    if (hadBirthdayThisYear) {
        return personAge
    } else {
        personAge -= 1
        return personAge
    }
}

export function extractFormData(formData: FormData): IRegister | null {
    if (!formData || Array.from(formData.keys()).length === 0) return null
    const allowedKeys: (keyof IRegister)[] = ['email', 'birthdayDate', 'firstName', 'lastName', 'password']
    const collectedData: Partial<IRegister> = {}
    formData.forEach((v, k) => {
        if (isKeyValid<IRegister>(k, allowedKeys) && typeof v === 'string') {
            collectedData[k] = v

        }
    })
    return collectedData as IRegister
}

export function validate(obj: Record<string, unknown>,config: IGlobalConfig,validators: IValidators
): boolean {
    let isValid = true
    for (const property in obj) {
        if (!config[property]) continue
        const value = obj[property]
        const existingValidators = config[property]

        let key: keyof IConfig
        for (key in existingValidators) {
            const ruleFn = validators[key]
            if (!ruleFn) continue
            const executedFunctionResult = ruleFn(value, config[property][key])
            if (!executedFunctionResult) {
                isValid = false
            }
        }
    }

    return isValid
}


function isKeyValid<T>(key: string, allowed: (keyof T & string)[]): key is keyof T & string {
    return allowed.includes(key as keyof T & string)
}


export function checkDataRequirements({ email, password, firstName, lastName, birthdayDate }: IRegister, requirementConfig: IRegisterConfig): Record<keyof IRegister, boolean> | null {
    const nonCompilantProperties = {} as Record<keyof IRegister, boolean>
    const today = new Date()
    const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    if (password.length < requirementConfig.password.min || password.length > requirementConfig.password.max) {
        nonCompilantProperties['password'] = false
    }
    if (email.length < requirementConfig.email.min || email.length > requirementConfig.email.max) {
        nonCompilantProperties['email'] = false
    }
    if (checkPersonalDataRequirement(firstName, requirementConfig)) {
        nonCompilantProperties['firstName'] = false
    }
    if (checkPersonalDataRequirement(lastName, requirementConfig)) {
        nonCompilantProperties['lastName'] = false
    }
    if (getPersonAge(birthdayDate, currentDate) < requirementConfig.minimalUsageAge) {
        nonCompilantProperties['birthdayDate'] = false
    }
    if (Object.keys(nonCompilantProperties).length === 0) {
        return null
    }
    return nonCompilantProperties
}

function checkPersonalDataRequirement(personInfo: string, { personalData, personalDataRegex }: IRegisterConfig) {
    const correctPersonalData: string = personInfo.trim();
    return (correctPersonalData.length < personalData.min || correctPersonalData.length > personalData.max) || personalDataRegex.test(personInfo)
}