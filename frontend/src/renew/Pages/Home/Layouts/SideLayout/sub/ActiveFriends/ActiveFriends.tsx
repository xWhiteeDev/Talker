import type { IActiveFriendsProps, IActiveUser } from './types';
import Window from '../../../../../../Components/Window/Window';
import FlexContainer from '../../../../../../Components/FlexContainer/FlexContainer';
import CustomText from '../../../../../../Components/CustomText/CustomText';
import UserAvatar from '../../../../../../Components/User/UserAvatar/UserAvatar';
import style from './ActiveFriends.module.css';
function ActiveDot() {
  return <div className={style.ActiveFriendsDot}></div>;
}

function ActiveUser(props: IActiveUser) {
  return (
    <FlexContainer
      shrink={0}
      borderBottom="1px solid #0000002a"
      width="100%"
      height="5.1vh"
      gap="0.5rem"
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      <UserAvatar
        height="4vh"
        aspectRatio="1/1"
        avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMiYCLtBhfMovIu7D7gIX6kxoq41qISxnan8s63qjYGg&s=10"
      />
      <CustomText text={`${props.firstName} ${props.lastName}`} color="black" fontSize={'1.1rem'} />
      <ActiveDot />
    </FlexContainer>
  );
}

export default function ActiveFriends(props: IActiveFriendsProps) {
  return (
    <Window withShadow height="56vh" width="15vw" backgroundColor="#fafafaea" description="Active friends">
      <FlexContainer
        width="100%"
        justifyContent="center"
        alignItems="center"
        gap="0.4rem"
        height="52vh"
        direction="column"
        overflowY="auto"
        scrollbarGutter="stable"
      >
        {props.children ?? <CustomText text="?" fontSize="7rem" fontWeight="600" color="#000000be" />}
      </FlexContainer>
    </Window>
  );
}
