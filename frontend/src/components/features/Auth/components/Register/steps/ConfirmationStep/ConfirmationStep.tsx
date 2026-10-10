import { useState } from 'react';
import FlexContainer from '../../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../../renew/Components/Input/Input';
import Button from '../../../../../../../renew/Components/Button/Button';
import { PARAMETERS_REQUIREMENTS } from '../../../../../../../cfg';
import CustomText from '../../../../../../../renew/Components/CustomText/CustomText';
import type { IAccount, IPersonal } from '../../types';
import emitServer from '../../../../../../../lib/API/emitServer';
import { EmitError } from '../../../../../../../lib/Error/EmitError';
import {useNavigate} from 'react-router-dom';

interface IConfirmationStep {
  account: IAccount;
  personal: IPersonal;
}

function ConfirmationStep(props: IConfirmationStep) {
  const [code, setCode] = useState<string>('');
  const isCodeValid = code.trim().length === PARAMETERS_REQUIREMENTS.CODE;
  const [message, setMessage] = useState<string | null>(null);
  const [isResendButtonDisabdled,setResendButtonDisabled] = useState<boolean>(false);
  const nav = useNavigate()
  const confirmAccount = async () => {
    try {
      const res = await emitServer<boolean>('/api/code/confirmCode', 'POST', {
        email: props.account.email?.trim().toLowerCase(),
        code: code,
      });
      if (res.data) {
        nav('/signin')
        //TODO:NOTIFICATION FOR USER
      }
    } catch (error) {
      if (error instanceof EmitError) {
        setMessage(error.message);
      }
    }
  };
  const sendCodeAgain = async() => {
    if (isResendButtonDisabdled) return
    try {
      const result = await emitServer<boolean>('/api/code/verifyCode', 'POST', {
        email: props.account.email?.trim().toLowerCase(),

      });
      if (result.data) {
        setResendButtonDisabled(true);
        setCode('')
        setTimeout(()=>{
          setResendButtonDisabled(false)
        },60000)
      }
    } catch (error) {
      if (error instanceof EmitError) {
        setMessage(error.message);
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
        minLength={PARAMETERS_REQUIREMENTS.CODE}
        maxLength={PARAMETERS_REQUIREMENTS.CODE}
        fontSize="1rem"
        type="text"
        fontWeight="600"
        width="18vw"
        height="6vh"
        placeholder="Code from email"
        inputMode="numeric"
        autoComplete="one-time-code"
        onInput={(v) => setCode(v)}
        value={code}
      />
      <Button
        width="12vw"
        height="5vh"
        text={"I didn't receive any code"}
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
        disabled={isResendButtonDisabdled}
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
      <div style={{ color: 'red' }}>{message}</div>
    </FlexContainer>
  );
}
export default ConfirmationStep;
