import Button from '../../../../../../../renew/Components/Button/Button';
import CustomText from '../../../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../../renew/Components/Input/Input';
import type { IAccount, TSteps } from '../../types';
import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { ACCOUNT_INPUTS, isEmailTaken } from './accountStep.service';
import { EmitError } from '../../../../../../../lib/Error/EmitError';
import { BRUTE_FORCE, PARAMETERS_REQUIREMENTS } from '../../../../../../../cfg';

interface IAccountStepProps {
  setStep(steps: TSteps): void;
  setAccount: Dispatch<SetStateAction<IAccount>>;
  account: IAccount;
}

type TCausedElement = 'email' | 'password' | 'repassword' | 'none';

interface IFieldError {
  caused: TCausedElement;
  message: string;
}

function AccountStep(props: IAccountStepProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IFieldError | null>(null);

  const bruteForceAttemps = useRef<number>(0);

  const lastTimeClicked = useRef<number>(0);

  const [isBruteForceProtectionActive, setBruteForceProtectionActive] = useState<boolean>(false);

  const submitAccountForm = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBruteForceProtectionActive || loading) {
      return;
    }
    const timeBetween: number = Date.now() - lastTimeClicked.current;

    if (timeBetween <= 500) {
      bruteForceAttemps.current++;
    } else {
      bruteForceAttemps.current = 0;
    }

    if (bruteForceAttemps.current >= BRUTE_FORCE.MAX_ATTEMPTS) {
      setBruteForceProtectionActive(true);
      setError({ caused: 'none', message: 'Too many attempts, wait a moment.' });
      setTimeout(() => {
        bruteForceAttemps.current = 0;
        setBruteForceProtectionActive(false);
        setError(null);
      }, BRUTE_FORCE.BRUTE_FORCE_PROTECTION_MAX_TIME);
      return;
    }
    setError(null);
    const email: string | undefined = props.account.email?.trim();

    if (!email || email.length < PARAMETERS_REQUIREMENTS.EMAIL.MIN) {
      setError({ caused: 'email', message: 'Invalid email' });
      return;
    }
    if (props.account.password && props.account.password .length < PARAMETERS_REQUIREMENTS.PASSWORD.MIN) {
      setError({ caused: 'password', message: `Password is too short! Min: ${PARAMETERS_REQUIREMENTS.PASSWORD.MIN}` });
      return;
    }
    if (props.account.repassword  && props.account.repassword  !== props.account.password ) {
      setError({ caused: 'repassword', message: 'Repassword is not the same as password' });
      return;
    }
    setLoading(true);
    try {
      const result = await isEmailTaken(email);
      if (result) {
        setError({ caused: 'email', message: 'Invalid data' });
        return;
      }
      props.setStep('confirmation');
    } catch (err) {
      if (err instanceof EmitError) {
        setError({ caused: 'none', message: err.message });
      } else {
        setError({ caused: 'none', message: 'Unknown server error' });
      }
    } finally {
      setLoading(false);
      lastTimeClicked.current = Date.now();
    }
  };

  const updateField = (field: keyof IAccount, value: string) => {
    props.setAccount((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <FlexContainer width="100%" height="auto" alignItems="center" justifyContent="center" direction="column">
      <form style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }} onSubmit={submitAccountForm}>
        {ACCOUNT_INPUTS.map(({ name, borderErrorCondition, ...rest }) => (
          <Input
            key={name}
            {...rest}
            fontSize="1rem"
            width="18vw"
            height="6vh"
            required
            border={
              (props.account[name] && borderErrorCondition(props.account[name].length)) || error?.caused === name
                ? '1px solid red'
                : '1px solid #0000'
            }
            value={props.account[name] ?? ''}
            onInput={(v) => {
              if (error && error.caused === name) {
                setError(null);
              }
              updateField(name, v);
            }}
          />
        ))}
        <Button
          width="8vw"
          height="5vh"
          text={
            <span>
              <b>Join</b> us
            </span>
          }
          backgroundColor="#43d14350"
          itemsJustifyPosition="center"
          itemsAlignPosition="center"
          fontSize="1.3rem"
          type="submit"
          disabled={isBruteForceProtectionActive || loading}
        />
        <FlexContainer width="auto" height="1.5vh" justifyContent="center" alignItems="center">
          {error && <CustomText text={error.message} color="red" />}
        </FlexContainer>
        <CustomText
          color="black"
          fontWeight="400"
          fontSize="1.2rem"
          textAlign="center"
          text={
            <span>
              By clicking <b>Join Us</b>, you agree to all the terms and conditions of the Talker platform as set out in our Terms
              of Service. Ignorance of the terms does not exempt you from complying with them or from liability for breaching
              them.
            </span>
          }
        />
      </form>
    </FlexContainer>
  );
}
export default AccountStep;
