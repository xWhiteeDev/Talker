import { useState } from 'react';
import Button from '../../../../../renew/Components/Button/Button';
import CustomText from '../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../renew/Components/Input/Input';
import style from './Register.module.css';
import Final from './sub/Final';
import Confirmation from './sub/Confirmation';
function Register() {
  const [step, setStep] = useState<number>(0);
  return (
    <>
      <div className={style.container}>
        <div className={style.loginContainer}>
          <CustomText
            text={
              step <= 1 ? (
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
          {step === 1 && (
            <Final
              onSubmit={() => {
                setStep(2);
              }}
            />
          )}
          {step === 0 && (
            <>
              <FlexContainer
                gap="0.8rem"
                width="100%"
                height="auto"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Input fontSize="1rem" type="text" width="18vw" height="6vh" placeholder="First name" />
                <Input fontSize="1em" type="text" width="18vw" height="6vh" placeholder="Last name" />
              </FlexContainer>
              <FlexContainer
                gap="1rem"
                width="100%"
                height="auto"
                alignItems="flex-start"
                justifyContent="center"
                direction="row"
              >
                <Input fontSize="0.8rem" type="text" width="10vw" height="5vh" placeholder="Where do you live?" />
                <Input fontSize="0.8rem" type="text" width="10vw" height="5vh" placeholder="Are you male or female?" />
              </FlexContainer>
              <FlexContainer
                gap="1rem"
                width="100%"
                height="auto"
                alignItems="center"
                justifyContent="flex-start"
                direction="column"
              >
                <Input fontSize="1rem" type="text" width="18vw" height="5vh" placeholder="How old are you?" />
              </FlexContainer>
              <Button icon='arrow_r' itemsJustifyPosition='center' fontSize='1.2rem' text="Next step" onClick={() => setStep(1)} width="9vw" height="5vh" backgroundColor="#94a3c02c" />
            </>
          )}
          {step === 2 && <Confirmation />}
        </div>
      </div>
    </>
  );
}
export default Register;
