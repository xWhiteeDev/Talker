import type { IRegisterConfig, IRegisterFormData } from "../../../interfaces/services/routes/Auth/IRegister";

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

export function extractFormData(formData: FormData): IRegisterFormData | null {
    if (!formData || Array(formData).length == 0) return null
    const allowedKeys: (keyof IRegisterFormData)[] = ['email', 'birthdayDate', 'firstName', 'lastName', 'password']
    const collectedData: Partial<IRegisterFormData> = {}
    formData.forEach((v, k) => {
        if (isKeyValid<IRegisterFormData>(k, allowedKeys) && typeof v === 'string') {
            collectedData[k] = v

        }
    })
    return collectedData as IRegisterFormData
}

function isKeyValid<T>(key: string, allowed: (keyof T & string)[]): key is keyof T & string {
    return allowed.includes(key as keyof T & string)
}


export function checkDataRequirements({ email, password, firstName, lastName, birthdayDate }: IRegisterFormData, requirementConfig: IRegisterConfig): Record<keyof IRegisterFormData, boolean> | {} {
    const nonCompilantProperties = {} as Record<keyof IRegisterFormData, boolean>
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
    return nonCompilantProperties
}

function checkPersonalDataRequirement(personInfo: string, { personalData, personalDataRegex }: IRegisterConfig) {
    const correctPersonalData: string = personInfo.trim();
    return (correctPersonalData.length < personalData.min || correctPersonalData.length > personalData.max) || personalDataRegex.test(personInfo)
}