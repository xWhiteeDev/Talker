
import type { NavigateFunction } from "react-router-dom";
import type { INotificationContext } from "../../../interfaces/context/INotificationContext";
import type { IRegisterConfig, IRegister, IGlobalConfig, TransmitionResult } from "../../../interfaces/services/routes/Auth/IAuth";
import { ErrorHandler } from "../../customError";
import { loginValidationConfig, registerValidationConfig } from "../../../configs/validations";


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

export function validateFormData<T>(formData: FormData, cfg: IGlobalConfig): T | null {
    if (!formData) throw new ErrorHandler('Form data empty', 400);
    const formDataProperties: Record<string, unknown> = {}
    const validatedProperties: Record<string, unknown> = {}
    formData.forEach((v, k) => {
        formDataProperties[k] = v;
    })
    for (const property in formDataProperties) {
        const propertyValue = formDataProperties[property]
        if (!cfg[property]) continue
        if (cfg[property].trim && (typeof propertyValue !== 'object' && !Array.isArray(propertyValue))) {
            if (typeof propertyValue === 'number') {
                formDataProperties[property] = String(propertyValue).trim()
            }
            if (typeof propertyValue === 'string') {
                formDataProperties[property] = propertyValue.trim()

            }
        }
        if (cfg[property].length) {
            if (typeof propertyValue === 'number') {
                const newValue = String(propertyValue).length
                if (newValue < cfg[property].length.min || newValue > cfg[property].length.max) continue

            }
            if (typeof propertyValue === 'string') {
                const newValue = propertyValue.length
                if (newValue < cfg[property].length.min || newValue > cfg[property].length.max) continue

            }
            if (typeof propertyValue === 'object' && !Array.isArray(propertyValue)) {
                const newValue = Array.from(Object.keys(propertyValue as {})).length
                if (newValue < cfg[property].length.min || newValue > cfg[property].length.max) continue

            }
            if (Array.isArray(propertyValue)) {
                const newValue = propertyValue.length
                if (newValue < cfg[property].length.min || newValue > cfg[property].length.max) continue

            }
        }
        if (cfg[property].regexp && (typeof propertyValue !== 'object' && !Array.isArray(propertyValue))) {

            if (typeof propertyValue === 'number') {
                if (!cfg[property].regexp.test(String(propertyValue))) continue
            }
            if (typeof propertyValue === 'string') {
                if (!cfg[property].regexp.test(propertyValue)) continue
            }
        }
        if (cfg[property].minimalUsageAge && (typeof propertyValue !== 'object' && !Array.isArray(propertyValue))) {
            const today = new Date()
            const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            if (typeof propertyValue === 'string') {
                if (getPersonAge(propertyValue, currentDate) < cfg[property].minimalUsageAge) continue
            }
        }
        if (property == 'firstName' || property == 'lastName') {
            checkPersonalDataRequirement(propertyValue as string, cfg[property])
        }
        validatedProperties[property] = formDataProperties[property]
    }
    return validatedProperties as T
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


export async function handleSubmitLoginForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: INotificationContext, navigation: NavigateFunction): Promise<boolean> {
    if (!event || !notificationContext || !navigation) {
        return false
    }
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const validationResult = validateFormData(formData, loginValidationConfig)
    if (!validationResult) {
        notificationContext.setNotify({
            type: 'error',
            message: 'Validation failed!'
        })
        return false
    }
    const endpoint = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth/login`
    const endpointValid = isEndpointValid(endpoint)
    if (!endpointValid) return false
    const transmitionResult = await transmitionToServer(endpoint, validationResult);
    if (!transmitionResult.success) {
        notificationContext.setNotify({
            type: 'error',
            message: transmitionResult.message
        })
        return false
    }
    navigation('/');
    notificationContext.setNotify({
        type: 'success',
        message: 'Login succeed'
    })
    return true
}



async function transmitionToServer(endpoint: string, toTransmite: unknown): Promise<TransmitionResult> {

    if (!endpoint) {
        return { success: false, message: "Endpoint not provided" }
    }
    try {
        const res = await fetch(endpoint, {
            method: 'POST', headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ data: toTransmite })
        })
        const data = await res.json()
        if (!res.ok) {
            return { success: false, message: data.message }
        }
        return { success: true, data }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message }
        } else {
            return { success: false, message: 'Unknown error' }
        }
    }

}

function isEndpointValid(endpoint: string): boolean {
    try {
        new URL(endpoint).origin
        return true
    } catch (error) {
        return false
    }
}


export async function handleSubmitRegisterForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: INotificationContext, navigation: NavigateFunction): Promise<boolean> {
    if (!event || !notificationContext || !navigation) {
        return false
    }
    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const validateResult = validateFormData(formData, registerValidationConfig);
    if (!validateResult) {
        notificationContext.setNotify({
            type: 'error',
            message: 'Validation failed!'
        })
        return false
    }
    const endpoint = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth/register`
    if (!isEndpointValid(endpoint)) {
        notificationContext.setNotify({
            type: 'error',
            message: 'Endpoint is wrong! Contact with Admin'
        })
        return false
    }
    const transmitionResult = await transmitionToServer(endpoint, validateResult);
    if (!transmitionResult.success) {
        notificationContext.setNotify({
            type: 'error',
            message: transmitionResult.message
        })
        return false
    }
    navigation('/auth/login');
    notificationContext.setNotify({
        type: 'success',
        message: 'Account created'
    })
    return true
}