import { emitServer } from '../../../../lib/API/emitServer';
import { ErrorHandler } from '../../../../lib/customError';
import { validate } from '../../../../services/validationService';
import type { GlobalConfiguration, ValidationFunctions } from '../../../../types/Validator';
import type { CustomNotificationContext, IAuthContext } from '../../../../types/Context';
import type { IUser } from '../../../../types/User';
import type { NavigateFunction } from 'react-router-dom';

interface AuthorizationInfo {
  transmisionEndpoint: string;
  successContent?: string;
  validationConfiguration: GlobalConfiguration;
  validationFunctions: ValidationFunctions;
}

export async function handleSubmitAuthForm(
  event: React.SubmitEvent<HTMLFormElement>,
  notificationContext: CustomNotificationContext,
  authorizationContext: IAuthContext,
  nav: NavigateFunction,

  authorizationInfo: AuthorizationInfo,
) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const objectifiedFormData = Object.fromEntries(formData);
  const validationResult = validate(
    objectifiedFormData,
    authorizationInfo.validationConfiguration,
    authorizationInfo.validationFunctions,
  );
  if (!validationResult) {
    notificationContext.setNotify({
      type: 'error',
      message: 'Validation failed!',
    });
    return false;
  }
  const transmisionUrl = `/api/auth/${authorizationInfo.transmisionEndpoint}`;
  try {
    const res = await emitServer<IUser>(transmisionUrl, 'POST', objectifiedFormData);
    if (!res || (res && !res.success)) {
      nav('/auth/login');
      return
    }
    const loginResult = authorizationContext.login(res.data);
    if (loginResult) {
      nav('/');
    } else {
      nav('/auth/login');
    }
    console.log(authorizationContext.user)
  } catch (error) {
    if (error instanceof ErrorHandler) {
      notificationContext.setNotify({
        type: 'error',
        message: error.message,
      });
    } else {
      notificationContext.setNotify({
        type: 'error',
        message: 'Unknown server error',
      });
    }
    return false;
  }
  return true;
}
