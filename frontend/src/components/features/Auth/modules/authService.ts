import { emitServer } from '../../../../lib/API/emitServer';
import { ErrorHandler } from '../../../../lib/customError';
import { validate } from '../../../../services/validationService';
import type { IGlobalConfiguration, IValidationFunctions } from '../../../../types/services/IValidator';
import type { IBasicUserInfo } from '../../../../types/components/IUser';
import type { TNotificationType } from '../../../../types/components/IComponentsUnion';

interface AuthorizationInfo {
  transmisionEndpoint: string;
  validationConfiguration: IGlobalConfiguration;
  validationFunctions: IValidationFunctions;
}

export async function handleSubmitAuthForm(
  event: React.SubmitEvent<HTMLFormElement>,
  notifcationFunction: (type: TNotificationType, message: string) => void,
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
    notifcationFunction('error', 'Validation failed!');
    return false;
  }
  const transmisionUrl = `/api/auth/${authorizationInfo.transmisionEndpoint}`;
  try {
    const res = await emitServer<IBasicUserInfo>(transmisionUrl, 'POST', objectifiedFormData);
    if (!res || res.success === false) {
      throw new ErrorHandler('Failed to authorize', 400);
    }
    return { success: res.success, data: res.data };
  } catch (error) {
    if (error instanceof ErrorHandler) {
      notifcationFunction('error', error.message);
    } else {
      notifcationFunction('error', 'Unknown server error');
    }
    return false;
  }
}
