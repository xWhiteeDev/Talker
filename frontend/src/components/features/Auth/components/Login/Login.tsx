import CustomText from '../../../../../renew/Components/CustomText/CustomText';
import style from './Login.module.css';
import { Icon } from '../../../../../renew/Components/Icon/Icon';
import Logo from '../../../../generic/UI/Logo/Logo';
import React, { useState } from 'react';
import { ACCOUNT_CONFIG } from '../../../../../configurations/account.config';
import emitServer from '../../../../../lib/API/emitServer';
import { LoginStep } from './steps/LoginStep';
import { useNavigate } from 'react-router-dom';
import type { features } from './Login.service';
import ConfirmationStep from '../ConfirmationStep/ConfirmationStep';

type TLoggingSteps = 'login' | 'confirmation';

function Login() {
  const [showcase, setShowcase] = useState<keyof typeof features>('add_user');
  const nav = useNavigate();
  const [loginData, setLoginData] = useState<ILogin>({ email: null, password: null });
  const [step, setStep] = useState<TLoggingSteps>('login');
  const handleSubmitLoginForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return false;
    const email: string = loginData.email.trim().toLowerCase();
    const password: string = loginData.password;
    if (
      !email ||
      email.length < ACCOUNT_CONFIG.EMAIL.MIN ||
      email.length > ACCOUNT_CONFIG.EMAIL.MAX ||
      !ACCOUNT_CONFIG.EMAIL.REGEX.test(email)
    ) {
      return false;
    }
    if (!password || password.length < ACCOUNT_CONFIG.PASSWORD.MIN) return false;
    const payload = {
      email: email,
      password: password,
    };
    const signResult = await emitServer<ILoginResponse>('/api/auth/signin', 'POST', payload);
    if (signResult.success) {
      if (signResult.data?.verified === 'unverified') {
        setStep('confirmation');
      } else if (signResult.data?.verified === 'verified') {
        console.log('Actually verified');
        nav('/home')
        //SET AUTH CONTEXT
        // SHOW NOTIFICATION 
      }
    }
  };

  return (
    <>
      {showcase && step == 'login' && (
        <LoginStep
          onLoginConfirmation={handleSubmitLoginForm}
          loginData={loginData}
          setLoginData={setLoginData}
          onSignUpClick={() => nav('/signup')}
          showcase={showcase}
          setShowcase={setShowcase}
        ></LoginStep>
      )}
      {step === 'confirmation' && loginData.email && loginData.password && (
        <div className={style.confirmationFixture}>
          <CustomText text="One more thing." color='black' fontSize='1.4rem' fontWeight='600'/>
          <ConfirmationStep email={loginData.email} onConfirmed={() => console.log('Confirmed email in login step')} />
        </div>
      )}
    </>
  );
}
export default Login;
