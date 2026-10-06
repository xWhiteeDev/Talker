import Button from '../../../../../renew/Components/Button/Button';
import Checkbox from '../../../../../renew/Components/Checkbox/Checkbox';
import CustomText from '../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../renew/Components/Input/Input';
import style from './Login.module.css';
import CustomLink from '../../../../../renew/Components/CustomLink/CustomLink';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../../../renew/Components/Icon/Icon';
import Logo from '../../../../generic/UI/Logo/Logo';
import { useState } from 'react';
import { PARAMETERS_REQUIREMENTS } from '../../../../../cfg';

const features = {
  chat: 'Chat with your friends with no limits!',
  group: 'Keep group in one place.',
  add_user: 'Invite anyone in a few seconds.',
  adventures: 'Discover new people and communities.',
  news: 'Stay up to date with what matters to you.',
} as const;

interface ILogin {
  email: string;
  password: string;
}

function Login() {
  const navigator = useNavigate();
  const [showcase, setShowcase] = useState<keyof typeof features>();
  const [loginData, setLoginData] = useState<ILogin>({ email: '', password: '' });
  return (
    <>
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

        <div className={style.loginContainer}>
          <FlexContainer
            gap="1.2rem"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="flex-start"
            direction="column"
          >
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
            <FlexContainer width="100%" height="auto" gap="0.2rem" alignItems="center" direction="column">
              <Input
                icon="email"
                iconAspectRatio="1/1"
                iconWidth="7%"
                fontSize="1.45rem"
                type="email"
                width="18vw"
                height="6vh"
                placeholder="E-mail"
                minLength={PARAMETERS_REQUIREMENTS.EMAIL.MIN}
                maxLength={PARAMETERS_REQUIREMENTS.EMAIL.MAX}
                value={loginData.email}
                onInput={(value) => setLoginData((prev) => ({ ...prev, email: value }))}
              />
              <Input
                icon="password"
                iconAspectRatio="1/1"
                value={loginData.password}
                iconWidth="7%"
                fontSize="1.45em"
                type="password"
                width="18vw"
                height="6vh"
                placeholder="Password"
                minLength={PARAMETERS_REQUIREMENTS.PASSWORD.MIN}
                maxLength={PARAMETERS_REQUIREMENTS.PASSWORD.MAX}
                onInput={(value) => setLoginData((prev) => ({ ...prev, password: value }))}
              />
            </FlexContainer>

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
              disabled={!(loginData && loginData.email && loginData.password)}
              backgroundColor="#43d14370"
              padding="1em"
              icon="arrow_r"
              iconAspectRatio="1/1"
              iconWidth="30rem"
              fontSize="1.25rem"
              itemsJustifyPosition="center"
              itemsAlignPosition="center"
              gap="0.4rem"
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
              onClick={() => navigator('/signup')}
              icon="circle_plus"
              iconAspectRatio="1/1"
              iconWidth="30rem"
              fontSize="1.25rem"
              itemsJustifyPosition="center"
              itemsAlignPosition="center"
              gap="0.4rem"
            />
          </FlexContainer>
        </div>
        <div className={style.additionalText}>
          {showcase && (
            <CustomText
              key={showcase}
              className={style.featureShowcase}
              text={features[showcase]}
              fontSize="3.2rem"
              textAlign="center"
              color="black"
              fontWeight="600"
            />
          )}
        </div>
        <div className={style.bar}>
          <Icon name="chat" width="40vw" aspectRatio="1/1" onHover={(name: any) => setShowcase(name)} />
          <Icon name="group" width="40vw" aspectRatio="1/1" onHover={(name: any) => setShowcase(name)} />
          <Icon name="add_user" width="40vw" aspectRatio="1/1" onHover={(name: any) => setShowcase(name)} />
          <Icon name="adventures" width="40vw" aspectRatio="1/1" onHover={(name: any) => setShowcase(name)} />
          <Icon name="news" width="40vw" aspectRatio="1/1" onHover={(name: any) => setShowcase(name)} />
        </div>
      </div>
    </>
  );
}
export default Login;
