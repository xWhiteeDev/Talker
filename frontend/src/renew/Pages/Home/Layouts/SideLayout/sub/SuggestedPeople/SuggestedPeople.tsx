import Button from '../../../../../../Components/Button/Button';
import CustomText from '../../../../../../Components/CustomText/CustomText';
import FlexContainer from '../../../../../../Components/FlexContainer/FlexContainer';
import UserAvatar from '../../../../../../Components/User/UserAvatar/UserAvatar';
import Window from '../../../../../../Components/Window/Window';
import type { ISuggestedUserProps, ISuggestedPeopleProps } from '../types';

const isGreaterThan = (current: number, than: number) => {
  return current > than;
};

function SuggestedUser(props: ISuggestedUserProps) {
  const hasMutualFriends = isGreaterThan(props.mutualFriendsCount, 0);
  return (
    <FlexContainer width="100%" height="20%" direction="row" alignItems="center">
      <UserAvatar margin="0.45rem" avatarUrl={props.avatarUrl} height="86%" aspectRatio="1/1" />

      <FlexContainer width="60%" height="80%" direction="column" justifyContent="center">
        <CustomText
          text={`${props.firstName} ${props.lastName}`}
          color="black"
          fontSize={hasMutualFriends ? '1.0rem' : '1.1rem'}
          bottomBorder={hasMutualFriends ? '1px solid gray' : ''}
        />
        {hasMutualFriends ? (
          <CustomText text={<b> {props.mutualFriendsCount} Mutual friends</b>} color="black" fontSize="0.8rem" />
        ) : null}
      </FlexContainer>
      <Button
        borderRadius="100%"
        backgroundColor="#3636361c"
        icon="circle_plus"
        withoutShadow
        width="1.5vw"
        aspectRatio="1/1"
        itemsJustifyPosition="center"
        iconAspectRatio="1/1"
      />
    </FlexContainer>
  );
}

export default function SuggestedPeople(props: ISuggestedPeopleProps) {
  const hasSuggestedUsers = props.users && isGreaterThan(props.users.length, 0);
  return (
    <Window withShadow height="30vh" width="15vw" backgroundColor="#fafafaea" description="Suggested users">
      <FlexContainer
        width="100%"
        justifyContent={hasSuggestedUsers ? 'flex-start' : 'center'}
        alignItems="center"
        gap="0.4rem"
        height="100%"
        direction="column"
      >
        {hasSuggestedUsers ? (
          props.users.map((u) => (
            <SuggestedUser
              firstName={u.firstName}
              lastName={u.lastName}
              mutualFriendsCount={u.mutualFriendsCount}
              avatarUrl={u.avatarUrl}
              id={u.id}
              key={u.id}
            />
          ))
        ) : (
          <CustomText text="?" fontSize="7rem" fontWeight="600" color="#000000be" />
        )}
      </FlexContainer>
    </Window>
  );
}
