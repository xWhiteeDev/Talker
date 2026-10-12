import type { Dispatch, SetStateAction } from 'react';
import { ACCOUNT_CONFIG } from '../../../../../../configurations/account.config';
import Button from '../../../../../../renew/Components/Button/Button';
import Checkbox from '../../../../../../renew/Components/Checkbox/Checkbox';
import CustomLink from '../../../../../../renew/Components/CustomLink/CustomLink';
import FlexContainer from '../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../renew/Components/Input/Input';
import style from './LoginStep.module.css';
import type React from 'react';
import Logo from '../../../../../generic/UI/Logo/Logo';
import CustomText from '../../../../../../renew/Components/CustomText/CustomText';
import { features } from '../Login.service';
import { Icon } from '../../../../../../renew/Components/Icon/Icon';

interface ILoginData {
  email: string | null;
  password: string | null;
}

interface ILoginStepProps {
  onLoginConfirmation: (e: React.SubmitEvent<HTMLFormElement>) => void;
  loginData: ILoginData;
  setLoginData: Dispatch<SetStateAction<ILogin>>;
  onSignUpClick: () => void;
  setShowcase: React.Dispatch<React.SetStateAction<keyof typeof features>>;
  showcase: keyof typeof features;
}

export function LoginStep(props: ILoginStepProps) {
  return (
    <div className={style.container}>
      <div className={style.serviceLogo}>
        <Logo additionalStyle={{ width: '5vw' }} />
        <CustomText fontSize="0.8rem" color="#000000" fontWeight="600" textAlign="center" text={'Made in Poland | Europa'} />
      </div>
      <div className={style.welcomeContainer}>
        <CustomText
          fontSize="1.5rem"
          color="#000000d3"
          textAlign="center"
          text={
            <span>
              <b>Talker</b> is a modern European social media platform designed with simplicity and precision to deliver an
              exceptional product to the greatest society -<b> Because you deserve it.</b>
            </span>
          }
        />
      </div>
      <FlexContainer gap="1.2rem" width="100%" height="100%" alignItems="center" justifyContent="flex-start" direction="column">
        <div className={style.methodsContainer}>
          <Button
            icon="google"
            iconAspectRatio="1/1"
            border="1px solid orange"
            iconHeight="30vh"
            text={
              <span>
                Sign with <b>Google</b>
              </span>
            }
            width="90%"
            height="5vh"
            textAlign="start"
            backgroundColor="#ffffff48"
            itemsJustifyPosition="center"
            itemsAlignPosition="center"
          />
          <Button
            icon="apple"
            border="1px solid black"
            iconWidth="27vw"
            iconHeight="30vh"
            text={
              <span>
                Sign with <b>Apple</b>
              </span>
            }
            width="90%"
            height="5vh"
            textAlign="start"
            backgroundColor="#ffffff48"
            itemsJustifyPosition="center"
            itemsAlignPosition="center"
          />
          <Button
            icon="phone"
            iconAspectRatio="1/1"
            iconHeight="30vh"
            text={
              <span>
                Sign with <b>phone number</b>
              </span>
            }
            width="90%"
            height="5vh"
            textAlign="start"
            backgroundColor="#ffffff48"
            itemsJustifyPosition="center"
            itemsAlignPosition="center"
          />
        </div>
        <div className={style.loginContainer}>
          <FlexContainer width="100%" height="80%" gap="0.2rem" alignItems="center" justifyContent="center" direction="column">
            <form id="login-form" onSubmit={props.onLoginConfirmation}>
              <Input
                icon="email"
                iconAspectRatio="1/1"
                iconWidth="7%"
                fontSize="1.15rem"
                type="email"
                width="18vw"
                height="8vh"
                placeholder="E-mail"
                minLength={ACCOUNT_CONFIG.EMAIL.MIN}
                maxLength={ACCOUNT_CONFIG.EMAIL.MAX}
                value={props.loginData.email ?? ''}
                onInput={(value) => props.setLoginData((prev) => ({ ...prev, email: value }))}
              />
              <Input
                icon="password"
                iconAspectRatio="1/1"
                value={props.loginData.password ?? ''}
                iconWidth="7%"
                fontSize="1.15rem"
                type="password"
                width="18vw"
                height="8vh"
                placeholder="Password"
                minLength={ACCOUNT_CONFIG.PASSWORD.MIN}
                maxLength={ACCOUNT_CONFIG.PASSWORD.MAX}
                onInput={(value) => props.setLoginData((prev) => ({ ...prev, password: value }))}
              />
            </form>
          </FlexContainer>
        </div>
        <Checkbox text="Remember me" fontSize="1.2rem" />
        <CustomLink text={'Forgot password'} />
        <Button
          width="14vw"
          height="6vh"
          text={
            <span>
              <b>Sign</b> in
            </span>
          }
          disabled={!(props && props.loginData.email && props.loginData.password)}
          backgroundColor="#43d14370"
          padding="1em"
          icon="arrow_r"
          iconAspectRatio="1/1"
          iconWidth="30rem"
          fontSize="1.25rem"
          itemsJustifyPosition="center"
          itemsAlignPosition="center"
          gap="0.4rem"
          form="login-form"
          type="submit"
        />
        <Button
          width="14vw"
          height="6vh"
          text={
            <span>
              <b>Sign</b> up
            </span>
          }
          backgroundColor="#e9eee950"
          padding="1em"
          onClick={() => props.onSignUpClick()}
          icon="circle_plus"
          iconAspectRatio="1/1"
          iconWidth="30rem"
          fontSize="1.25rem"
          itemsJustifyPosition="center"
          itemsAlignPosition="center"
          gap="0.4rem"
        />
      </FlexContainer>

      <div className={style.additionalText}>
        {props.showcase && (
          <CustomText
            key={props.showcase}
            className={style.featureShowcase}
            text={features[props.showcase]}
            fontSize="3.2rem"
            textAlign="center"
            color="black"
            fontWeight="600"
          />
        )}
      </div>
      <div className={style.bar}>
        <Icon name="chat" width="40vw" aspectRatio="1/1" onHover={(name: any) => props.setShowcase(name)} />
        <Icon name="group" width="40vw" aspectRatio="1/1" onHover={(name: any) => props.setShowcase(name)} />
        <Icon name="add_user" width="40vw" aspectRatio="1/1" onHover={(name: any) => props.setShowcase(name)} />
        <Icon name="adventures" width="40vw" aspectRatio="1/1" onHover={(name: any) => props.setShowcase(name)} />
        <Icon name="news" width="40vw" aspectRatio="1/1" onHover={(name: any) => props.setShowcase(name)} />
      </div>
    </div>
  );
}
