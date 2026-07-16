import type {NavigateFunction} from "react-router-dom";
import type {CustomNotificationContext} from "../../../components/Notification/context/types";
import type {AuthorizationInfo} from "../types";
import {validate} from "../validation/validationService";
import {emitServer} from "../../../lib/API/fetch";
import {ErrorHandler} from "../../../lib/customError";
import type {EmitResult} from "../../../lib/API/types";




export async function handleSubmitAuthForm(event: React.SubmitEvent<HTMLFormElement>, notificationContext: CustomNotificationContext, navigation: NavigateFunction, authorizationInfo: AuthorizationInfo) {
    if (!event || !notificationContext || !navigation || Object.keys(authorizationInfo).length == 0) {
        return false;
    }
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const objectifiedFormData = Object.fromEntries(formData);
    const validationResult = validate(objectifiedFormData, authorizationInfo.validationConfiguration, authorizationInfo.validationFunctions);
    if (!validationResult) {
        notificationContext.setNotify({
            type: 'error',
            message: 'Validation failed!'
        });
        return false;
    }
    const transmisionUrl = `/api/auth/${authorizationInfo.transmisionEndpoint}`;
    try {
        await emitServer<EmitResult<unknown>>(transmisionUrl, 'POST', objectifiedFormData);
        navigation(authorizationInfo.navigationPoint);
        if (authorizationInfo.successContent) {
            notificationContext.setNotify({
                type: 'success',
                message: authorizationInfo.successContent
            });
        }
    } catch (error) {
        if (error instanceof ErrorHandler) {
            notificationContext.setNotify({
                type: 'error',
                message: error.message
            });
        } else {
            notificationContext.setNotify({
                type: 'error',
                message: 'Unknown server error'
            });
        }
        return false;
    }
    return true;
}