import { useState } from 'react';
import FlexContainer from '../../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../../renew/Components/Input/Input';
import Button from '../../../../../../../renew/Components/Button/Button';
import CustomText from '../../../../../../../renew/Components/CustomText/CustomText';
import type { IAccount, IPersonal } from '../../types';
import emitServer from '../../../../../../../lib/API/emitServer';
import { EmitError } from '../../../../../../../lib/Error/EmitError';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_CONFIG } from '../../../../../../../configurations/account.config';

interface IConfirmationStep {
  account: IAccount;
  personal: IPersonal;
}

function ConfirmationStep(props: IConfirmationStep) {
  const [code, setCode] = useState<string | null>(null);
  const isCodeValid = code && code.trim().length >= ACCOUNT_CONFIG.CODE.MIN && code.trim().length <= ACCOUNT_CONFIG.CODE.MAX;
  const [message, setMessage] = useState<string | null>(null);
  const [isResendButtonDisabled, setResendButtonDisabled] = useState<boolean>(false);
  const nav = useNavigate();
  const confirmAccount = async () => {
    try {
      const res = await emitServer<boolean>('/api/code/confirmCode', 'POST', {
        email: props.account.email?.trim().toLowerCase(),
        code: code,
      });
      if (res.success) {
        nav('/signin');
        //TODO:NOTIFICATION FOR USER
      }
    } catch (error) {
      if (error instanceof EmitError) {
        setMessage(error.message);
        setCode(null);
      }
    }
  };
  const sendCodeAgain = async () => {
    if (isResendButtonDisabled) return;
    try {
      const result = await emitServer<boolean>('/api/code/resendCode', 'POST', {
        email: props.account.email?.trim().toLowerCase(),
      });

      setMessage('');

      if (result.success) {
        setResendButtonDisabled(true);
        setCode('');
        setTimeout(() => {
          setResendButtonDisabled(false);
        }, 60000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      if (error instanceof EmitError || error instanceof Error) {
        setMessage(`${error.message}`);
      }
    }
  };
  return (
    <FlexContainer gap="1rem" width="100%" height="auto" alignItems="center" justifyContent="center" direction="column">
      <CustomText
        textAlign="center"
        text={
          <span>
            System sent into <b>{props.account.email}</b> a <b>code</b>. Write this code below in input to verify your account. If
            you don't see any e-mail from us - Check spam folder or others
          </span>
        }
        color="black"
      />
      <Input
        minLength={ACCOUNT_CONFIG.CODE.MIN}
        maxLength={ACCOUNT_CONFIG.CODE.MAX}
        fontSize="1rem"
        type="text"
        fontWeight="600"
        width="18vw"
        height="6vh"
        placeholder="Code from email"
        inputMode="numeric"
        autoComplete="one-time-code"
        onInput={(v) => setCode(v)}
        value={code ?? ''}
      />
      <Button
        width="12vw"
        height="5vh"
        text={'Resend code'}
        backgroundColor="#c6c6ca38"
        padding="1rem"
        color="black"
        icon="arrow_flip"
        iconAspectRatio="1/1"
        iconWidth="12%"
        itemsJustifyPosition="center"
        itemsAlignPosition="center"
        fontWeight="600"
        fontSize="0.8rem"
        gap="1rem"
        disabled={isResendButtonDisabled}
        onClick={sendCodeAgain}
      />
      <Button
        width="12vw"
        height="5vh"
        text={'Confirm account'}
        backgroundColor="#43d14350"
        padding="1rem"
        color="black"
        icon="accept"
        iconAspectRatio="1/1"
        iconWidth="12%"
        itemsJustifyPosition="center"
        itemsAlignPosition="center"
        fontWeight="600"
        fontSize="0.8rem"
        gap="1rem"
        disabled={!isCodeValid}
        onClick={confirmAccount}
      />
      <div style={{ width: 'auto', height: '2.5vh', color: 'red' }}>{message}</div>
    </FlexContainer>
  );
}
export default ConfirmationStep;
