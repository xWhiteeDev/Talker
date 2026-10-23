import {ACCOUNT_CONFIG} from "../../../../../../../configurations/account.config";
import emitServer from "../../../../../../../lib/API/emitServer";

export const ACCOUNT_INPUTS = [
  {
    name: 'email',
    type: 'email',
    icon: 'email',
    placeholder: 'E-mail',
    minLength: ACCOUNT_CONFIG.EMAIL.MIN,
    maxLength: ACCOUNT_CONFIG.EMAIL.MAX,
    borderErrorCondition: (length: number) => length < ACCOUNT_CONFIG.EMAIL.MIN || length > ACCOUNT_CONFIG.EMAIL.MAX
  },
  {
    name: 'password',
    type: 'password',
    icon: 'password',
    placeholder: 'Password',
    minLength: ACCOUNT_CONFIG.PASSWORD.MIN,
    maxLength: ACCOUNT_CONFIG.PASSWORD.MAX,
    borderErrorCondition: (length: number) => length < ACCOUNT_CONFIG.PASSWORD.MIN || length > ACCOUNT_CONFIG.PASSWORD.MAX

  },
  {
    name: 'repassword',
    type: 'password',
    icon: 'password',
    placeholder: 'Re-type password',
    minLength: ACCOUNT_CONFIG.PASSWORD.MIN,
    maxLength: ACCOUNT_CONFIG.PASSWORD.MAX,
    borderErrorCondition: (length: number) => length < ACCOUNT_CONFIG.PASSWORD.MIN || length > ACCOUNT_CONFIG.PASSWORD.MAX

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