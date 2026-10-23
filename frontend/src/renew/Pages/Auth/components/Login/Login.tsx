import CustomText from '../../../../Components/CustomText/CustomText';
import style from './Login.module.css';
import React, { useState } from 'react';
import { ACCOUNT_CONFIG } from '../../../../../configurations/account.config';
import { useNavigate } from 'react-router-dom';
import type { features } from './Login.service';
import ConfirmationStep from '../ConfirmationStep/ConfirmationStep';
import { useAuth } from '../../../../../hooks/useAuth';
import { EmitError } from '../../../../../lib/Error/EmitError';
import { LoginStep } from './steps/LoginStep/LoginStep';

type TLoggingSteps = 'login' | 'confirmation';

function Login() {
  const [showcase, setShowcase] = useState<keyof typeof features>('add_user');
  const nav = useNavigate();
  const [loginData, setLoginData] = useState<ILogin>({ email: null, password: null });
  const [step, setStep] = useState<TLoggingSteps>('login');

  const { setLogged } = useAuth();

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
    try {
      const result = await setLogged(payload.email, payload.password);
      switch (result.status) {
        case 'suspended':
          console.log('Account suspended, TODO');
          break;
      }
    } catch (error) {
      if (error instanceof EmitError) {
        if (error.statusCode == 403) {
          setStep('confirmation');
          console.log('test');
        }
      }
    }
  };
  const handleConfirmAccount = async () => {
    if (!loginData.email || !loginData.password) {
      //TODO:Notification here
      return false;
    }
    try {
      const userAuthorizationStatus = await setLogged(loginData.email, loginData.password);
      switch (userAuthorizationStatus.status) {
        case 'unverified':
          nav('/signin');
          break;
        case 'suspended':
          //TODO:Notification here
          nav('/signin');
          break;
        case 'ok':
          nav('/');
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof EmitError) {
        if (error.statusCode === 403) {
          //TODO:Notification here
          console.error('Confirmation: Spotted an error when tried to sign in again');
        }
      }
      return false;
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
          <CustomText text="One more thing." color="black" fontSize="1.4rem" fontWeight="600" />
          <ConfirmationStep email={loginData.email} onConfirmed={handleConfirmAccount} />
        </div>
      )}
    </>
  );
}
export default Login;
