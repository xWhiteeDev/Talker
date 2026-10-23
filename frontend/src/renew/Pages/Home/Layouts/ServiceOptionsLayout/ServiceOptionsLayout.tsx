import Button from '../../../../Components/Button/Button';
import FlexContainer from '../../../../Components/FlexContainer/FlexContainer';
import { buttonsList } from './buttonsList';

export default function ServiceOptionsLayout() {
  return (
    <FlexContainer width="90%" height="70%" gap="2%" alignItems="center" justifyContent="flex-end" borderRadius="10px">
      {buttonsList.map((b) => (
        <Button {...b} key={b.id} />
      ))}
    </FlexContainer>
  );
}
