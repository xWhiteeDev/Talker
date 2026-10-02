import Button from '../../../../../../renew/Components/Button/Button';
import CustomText from '../../../../../../renew/Components/CustomText/CustomText';
import FlexContainer from '../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../renew/Components/Input/Input';

function Confirmation() {
  return (
    <FlexContainer gap="1rem" width="100%" height="auto" alignItems="center" justifyContent="center" direction="column">
      <CustomText
        textAlign="center"
        text={
          <span>
            System sent into your email a <b>code</b>. Write this code below in input to verify your account. If you don't see any
            e-mail from us - Check spam folder or others
          </span>
        }
        color="black"
      />
      <Input
        min={4}
        max={4}
        fontSize="1rem"
        type="text"
        fontWeight="600"
        width="18vw"
        height="6vh"
        placeholder="Code from email"
      />
      <Button
        width="auto"
        height="5vh"
        text={"I didn't receive any code"}
        backgroundColor="#c6c6ca38"
        padding="2rem"
        color="black"
        icon="arrow_flip"
        iconAspectRatio="1/1"
        iconWidth="80%"
        itemsJustifyPosition="center"
        fontWeight='600'
      />
      <Button
        width="auto"
        height="5vh"
        text={
          <span>
            <b>Confirm</b> account
          </span>
        }
        backgroundColor="#43d14350"
        icon="accept"
        iconAspectRatio="1/1"
        iconWidth="80%"
        itemsJustifyPosition="center"
      />
    </FlexContainer>
  );
}
export default Confirmation;
