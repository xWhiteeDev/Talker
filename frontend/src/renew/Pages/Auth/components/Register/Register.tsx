import React, { useState } from 'react';
import CustomText from '../../../../Components/CustomText/CustomText';
import style from './Register.module.css';
import type { IAccount, IPersonal, TSteps } from './types';
import AccountStep from './steps/AccountStep/AccountStep';
import ConfirmationStep from '../ConfirmationStep/ConfirmationStep';
import PersonalStep from './steps/PersonalStep/PersonalStep';
import {useNavigate} from 'react-router-dom';


function Register() {
  const [step, setStep] = useState<TSteps>('personal');
  const nav = useNavigate()
  const [personalData, setPersonal] = useState<IPersonal>({
    firstName: null, 
    lastName: null,
    birthdayDate: null,
    livingPlace: null,
    gender: 'Prefer not to say',
  });
  const [accountData, setAccount] = useState<IAccount>({
    email: null,
    password: null,
    repassword: null,
  });
  const renderCurrentStep = () => {
    const steps: Record<TSteps, React.JSX.Element> = {
      personal: <PersonalStep setStep={setStep} setPersonal={setPersonal} personal={personalData} />,
      account: <AccountStep setStep={setStep} personal={personalData} setAccount={setAccount} account={accountData} />,
      confirmation: (accountData.email ? <ConfirmationStep email={accountData.email} onConfirmed={()=> nav('/signin')}  /> : <div>Missing email</div>)
    };
    return steps[step]
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.loginContainer}>
          <CustomText
            text={
              step === 'personal' || step === 'account' ? (
                <span>
                  Let us <b>know you better.</b>
                </span>
              ) : (
                <span>That's our last meeting! We sent to your email inbox an confirmation</span>
              )
            }
            color="black"
            fontSize="1.5rem"
            textAlign="center"
          />
          {renderCurrentStep()}
        </div>
      </div>
    </>
  );
}
export default Register;
