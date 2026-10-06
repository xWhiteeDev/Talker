import {PARAMETERS_REQUIREMENTS} from "../../../../../../../cfg";
import emitServer from "../../../../../../../lib/API/emitServer";
import {EmitError} from "../../../../../../../lib/Error/EmitError";

export const ACCOUNT_INPUTS = [
  {
    name: 'email',
    type: 'email',
    icon: 'email',
    placeholder: 'E-mail',
    minLength: PARAMETERS_REQUIREMENTS.EMAIL.MIN,
    maxLength: PARAMETERS_REQUIREMENTS.EMAIL.MAX,
    borderErrorCondition: (length: number) => length < PARAMETERS_REQUIREMENTS.EMAIL.MIN || length > PARAMETERS_REQUIREMENTS.EMAIL.MAX
  },
  {
    name: 'password',
    type: 'password',
    icon: 'password',
    placeholder: 'Password',
    minLength: PARAMETERS_REQUIREMENTS.PASSWORD.MIN,
    maxLength: PARAMETERS_REQUIREMENTS.PASSWORD.MAX,
    borderErrorCondition: (length: number) => length < PARAMETERS_REQUIREMENTS.PASSWORD.MIN || length > PARAMETERS_REQUIREMENTS.PASSWORD.MAX

  },
  {
    name: 'repassword',
    type: 'password',
    icon: 'password',
    placeholder: 'Re-type password',
    minLength: PARAMETERS_REQUIREMENTS.PASSWORD.MIN,
    maxLength: PARAMETERS_REQUIREMENTS.PASSWORD.MAX,
    borderErrorCondition: (length: number) => length < PARAMETERS_REQUIREMENTS.PASSWORD.MIN || length > PARAMETERS_REQUIREMENTS.PASSWORD.MAX

  },
] as const;

async function isEmailTaken(email: string) {
  try {
    const result = await emitServer<Record<string, unknown>>(`/api/auth?email=${email}`, 'GET');
    return result.data;
  } catch (error) {
    throw error
  }
}
export {isEmailTaken};