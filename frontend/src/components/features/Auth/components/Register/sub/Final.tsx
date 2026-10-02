import Button from '../../../../../../renew/Components/Button/Button';
import CustomText from '../../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../renew/Components/Input/Input';

interface IFinalProps {
    onSubmit?:()=>void
}

function Final(props:IFinalProps) {
  return (
    <FlexContainer gap="1rem" width="100%" height="auto" alignItems="center" justifyContent="center" direction="column">
      <Input icon="email" fontSize="1rem" type="email" width="18vw" height="6vh" placeholder="E-mail" />
      <Input icon="password" fontSize="1em" type="password" width="18vw" height="6vh" placeholder="Password" />
      <Input icon="password" fontSize="1em" type="password" width="18vw" height="6vh" placeholder="Re-type password" />
      <Button
        width="8vw"
        height="5vh"
        text={
          <span>
            <b>Join</b> us
          </span>
        }
        backgroundColor="#43d14350"
        itemsJustifyPosition='center'
        fontSize='1.3rem'
        onClick={props.onSubmit}
      />
      <CustomText
        color="black"
        fontWeight="400"
        fontSize="1.2rem"
        textAlign='center'
        text={
          <span>
            By clicking <b>Join Us</b>, you agree to all the terms and conditions of the Talker platform as set out in our Terms
            of Service. Ignorance of the terms does not exempt you from complying with them or from liability for breaching them.
          </span>
        }
      />
    </FlexContainer>
  );
}
export default Final;
