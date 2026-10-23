import Button from '../../../../Components/Button/Button';
import CustomText from '../../../../Components/CustomText/CustomText';
import FlexContainer from '../../../../Components/FlexContainer/FlexContainer';
import UserAvatar from '../../../../Components/User/UserAvatar/UserAvatar';
import { buttonsList } from './buttonsList';
import type { IUserLayoutProps } from './types';

export default function UserLayout(props: IUserLayoutProps) {
  return (
    <FlexContainer width={props.width ?? '100%'} height={props.height ?? '100%'} direction="column" backgroundColor={props.backgroundColor} borderRadius={props.borderRadius} justifyContent="flex-start" alignItems="center" gap="0.3rem">
      <UserAvatar isRounded avatarUrl={props.avatarUrl} margin="1rem" height='13vh' aspectRatio='1/1' />
      <CustomText text={`${props.firstName} ${props.lastName}`} color="black" fontWeight="600" fontSize="1.3rem" />
      <CustomText text={`@${props.username}`} color="#1111116c" fontWeight="600" fontSize="1.3rem" />
      <FlexContainer
        width="auto"
        height="auto"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap="2rem"
        direction="column"
        margin="1.2rem"
      >
        {buttonsList.map((b, i) => (
          <Button {...b} key={b.id} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
}
