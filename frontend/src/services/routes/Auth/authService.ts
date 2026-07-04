import type { NavigateFunction } from "react-router-dom";
import { validate, isUrlValid, transmitionToServer } from "../../../helpers/validationHelper";
import type { INotificationContext } from "../../../interfaces/context/INotificationContext";
import type { IAuthorization } from "../../../interfaces/services/routes/Auth/IAuth";



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


export async function handleSubmitAuthForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: INotificationContext, navigation: NavigateFunction, authorizationInfo: IAuthorization) {
    if (!event || !notificationContext || !navigation || Object.keys(authorizationInfo).length == 0) {
        return false
    }
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const objectifiedFormData = Object.fromEntries(formData)
    const validationResult = validate(objectifiedFormData,authorizationInfo.validationConfiguration, authorizationInfo.validationFunctions)
    if (!validationResult) {
        notificationContext.setNotify({
            type: 'error',
            message: 'Validation failed!'
        })
        return false
    }
    const transmisionUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth/${authorizationInfo.transmisionEndpoint}`
    const isTransmisionUrlValid = isUrlValid(transmisionUrl)
    if (!isTransmisionUrlValid) return false
    const transmitionResult = await transmitionToServer(transmisionUrl, 'POST', objectifiedFormData);
    if (!transmitionResult.success) {
        notificationContext.setNotify({
            type: 'error',
            message: transmitionResult.message
        })
        return false
    }
    navigation(authorizationInfo.navigationPoint);
    if (authorizationInfo.successContent) {
        notificationContext.setNotify({
            type: 'success',
            message: authorizationInfo.successContent
        })
    }

    return true
}



// export async function handleSubmitLoginForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: INotificationContext, navigation: NavigateFunction): Promise<boolean> {
//     if (!event || !notificationContext || !navigation) {
//         return false
//     }
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget)
//     const objectifiedFormData = Object.fromEntries(formData)
//     const validationResult = validate(objectifiedFormData, loginValidationConfig, validatorFunctions)
//     if (!validationResult) {
//         notificationContext.setNotify({
//             type: 'error',
//             message: 'Validation failed!'
//         })
//         return false
//     }
//     const endpoint = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth/login`
//     const endpointValid = isEndpointValid(endpoint)
//     if (!endpointValid) return false
//     const transmitionResult = await transmitionToServer(endpoint, 'POST', validationResult);
//     if (!transmitionResult.success) {
//         notificationContext.setNotify({
//             type: 'error',
//             message: transmitionResult.message
//         })
//         return false
//     }
//     navigation('/');
//     notificationContext.setNotify({
//         type: 'success',
//         message: 'Login succeed'
//     })
//     return true
// }


// export async function handleSubmitRegisterForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: INotificationContext, navigation: NavigateFunction): Promise<boolean> {
//     if (!event || !notificationContext || !navigation) {
//         return false
//     }
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget);
//     const objectifiedFormData = Object.fromEntries(formData)

//     const validateResult = validate(objectifiedFormData, registerValidationConfig, validatorFunctions);
//     if (!validateResult) {
//         notificationContext.setNotify({
//             type: 'error',
//             message: 'Validation failed!'
//         })
//         return false
//     }
//     const endpoint = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/auth/register`
//     if (!isEndpointValid(endpoint)) {
//         notificationContext.setNotify({
//             type: 'error',
//             message: 'Endpoint is wrong! Contact with Admin'
//         })
//         return false
//     }
//     const transmitionResult = await transmitionToServer(endpoint, 'POST', validateResult);
//     if (!transmitionResult.success) {
//         notificationContext.setNotify({
//             type: 'error',
//             message: transmitionResult.message
//         })
//         return false
//     }
//     navigation('/auth/login');
//     notificationContext.setNotify({
//         type: 'success',
//         message: 'Account created'
//     })
//     return true
// }