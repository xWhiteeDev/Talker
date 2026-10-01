import Button from '../../../../../renew/Components/Button/Button';
import Checkbox from '../../../../../renew/Components/Checkbox/Checkbox';
import CustomText from '../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../renew/Components/Input/Input';
import style from './Login.module.css';
import CustomLink from '../../../../../renew/Components/CustomLink/CustomLink';
function Login() {
  return (
    <>
      <div className={style.container}>
        <div className={style.welcomeContainer}>
          <CustomText
            fontSize="3.5rem"
            color="#00000080"
            textShadow="2px 6px 4px #0f0f0f4d"
            text={
              <span>
                <b>Stay</b> on track, <b>with</b> your <b>friends!</b>
              </span>
            }
          />
        </div>

        <div className={style.loginContainer}>
          <FlexContainer gap="1rem" width="100%" height="100%" alignItems="center" justifyContent="flex-start" direction="column">
            <div className={style.methodsContainer}>
              <Button
                icon="g"
                text={
                  <span>
                    Sign with <b>Google</b>
                  </span>
                }
                width="70%"
                height="5vh"
                textAlign="start"
                backgroundColor="#ffffff8e"
              />
              <Button
                text={
                  <span>
                    Sign with <b>Apple</b>
                  </span>
                }
                width="70%"
                height="5vh"
                textAlign="start"
                backgroundColor="#ffffff8e"
              />
              <Button
                text={
                  <span>
                    Sign with <b>phone number</b>
                  </span>
                }
                width="70%"
                height="5vh"
                textAlign="start"
                backgroundColor="#ffffff8e"
              />
            </div>
            <Input icon="email" fontSize="1.45rem" type="email" width="18vw" height="6vh" placeholder="E-mail" />
            <Input icon="password" fontSize="1.45em" type="password" width="18vw" height="6vh" placeholder="Password" />
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
              backgroundColor="#43d14350"
              padding="1em"
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
            />
          </FlexContainer>
        </div>
      </div>
    </>
  );
}
export default Login;
