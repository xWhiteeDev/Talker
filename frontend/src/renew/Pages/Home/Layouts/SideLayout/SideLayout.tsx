import FlexContainer from '../../../../Components/FlexContainer/FlexContainer';
import ActiveFriends from './sub/ActiveFriends/ActiveFriends';
import SuggestedPeople from './sub/SuggestedPeople/SuggestedPeople';

export default function SideLayout() {
  return (
    <FlexContainer justifyContent="flex-start" gap='3%' alignItems='center' direction='column' width="100%" height="100%">
      <SuggestedPeople />
      <ActiveFriends></ActiveFriends>
    </FlexContainer>
  );
}
