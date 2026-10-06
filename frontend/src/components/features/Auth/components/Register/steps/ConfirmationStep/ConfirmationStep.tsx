import { useState } from 'react';
import FlexContainer from '../../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../../renew/Components/Input/Input';
import Button from '../../../../../../../renew/Components/Button/Button';
import { PARAMETERS_REQUIREMENTS } from '../../../../../../../cfg';
import CustomText from '../../../../../../../renew/Components/CustomText/CustomText';
import type { IAccount, IPersonal } from '../../types';

interface IConfirmationStep {
  account: IAccount;
  personal: IPersonal;
}

function ConfirmationStep(props: IConfirmationStep) {
  const [code, setCode] = useState<string>('');
  const isCodeValid = code.trim().length === PARAMETERS_REQUIREMENTS.CODE;
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
      />
    </FlexContainer>
  );
}
export default ConfirmationStep;
