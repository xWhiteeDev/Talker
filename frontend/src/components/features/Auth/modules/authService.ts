import { emitServer } from '../../../../lib/API/emitServer';
import { ErrorHandler } from '../../../../lib/customError';
import type { IBasicUserInfo } from '../../../../types/components/IUser';
import type { TNotificationType } from '../../../../types/components/IComponentsUnion';
import { Validify } from '../../../../services/Validify';
import type { IObjectRequirements } from '../../../../services/types';

export async function handleSubmitAuthForm(
  event: React.SubmitEvent<HTMLFormElement>,
  notifcationFunction: (type: TNotificationType, message: string) => void,
  emitEndpoint: string,
  validationRequirements: IObjectRequirements,
) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const objectifiedFormData = Object.fromEntries(formData);
  const validationResult = Validify.validateObject(objectifiedFormData, validationRequirements);
  if (!validationResult) {
    notifcationFunction('error', 'Validation failed!');
    return false;
  }
  const transmisionUrl = `/api/auth/${emitEndpoint}`;
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
