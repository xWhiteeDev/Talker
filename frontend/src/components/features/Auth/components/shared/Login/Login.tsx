import CustomText from '../../../../../../newComponents/CustomText/CustomText';
import FlexContainer from '../../../../../../newComponents/FlexContainer/FlexContainer';

const welcomeTextArray = ['Stay on track, with your friends', `Don't miss out on the action!`, 'Great news awaits you!'];

export default function Login() {
  return (
    <FlexContainer direction="row" width="100vw" height="100vh" justifyContent="flex-start">
      <FlexContainer direction="row" width="45%" height="100vh" gap="4vw" justifyContent="center">
        <CustomText fontSize="2.8rem" text={<span><b>Stay</b> on track, <b>with</b> your <b>friends</b> </span>} color="#2e2e2ebe" withShadow={true} />
      </FlexContainer>
      <FlexContainer direction="row" width="100%" height="100vh" gap="4vw" justifyContent="center" />
    </FlexContainer>
  );
}
