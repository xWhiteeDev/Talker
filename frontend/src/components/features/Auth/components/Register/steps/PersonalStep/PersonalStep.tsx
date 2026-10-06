import Button from '../../../../../../../renew/Components/Button/Button';
import CustomSelect from '../../../../../../../renew/Components/CustomSelect/CustomSelect';
import FlexContainer from '../../../../../../../renew/Components/FlexContainer/FlexContainer';
import Input from '../../../../../../../renew/Components/Input/Input';
import style from './PersonalStep.module.css';
import { isPersonalDataValid } from '../../registerService';
import type { IPersonal, TSteps } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

interface IPersonalStepProps {
  setStep(steps: TSteps): void;
  setPersonal: Dispatch<SetStateAction<IPersonal>>;
  personal: IPersonal;
}

function PersonalStep(props: IPersonalStepProps) {
  const updateField = (
    field: keyof Pick<IPersonal, 'firstName' | 'lastName' | 'livingPlace' | 'gender' | 'birthdayDate'>,
    value: string,
  ) => {
    props.setPersonal((prev) => ({ ...prev, [field]: value }));
  };
  const isPersonalValid = isPersonalDataValid(props.personal);
  return (
    <form
      className={style.formStepZero}
      onSubmit={(e) => {
        e.preventDefault();
        if (isPersonalValid) {
          props.setStep('account');
        } else {
          console.log('Not valid');
        }
      }}
    >
      <FlexContainer gap="0.8rem" width="100%" height="auto" alignItems="center" justifyContent="center" direction="column">
        <Input
          fontSize="1rem"
          required
          type="text"
          fontWeight="600"
          width="18vw"
          height="6vh"
          placeholder="First name"
          value={props.personal.firstName}
          onInput={(v) => updateField('firstName', v)}
        />
        <Input
          fontSize="1rem"
          required
          type="text"
          width="18vw"
          height="6vh"
          placeholder="Last name"
          fontWeight="600"
          value={props.personal.lastName}
          onInput={(v) => updateField('lastName', v)}
        />
      </FlexContainer>
      <FlexContainer gap="1rem" width="100%" height="auto" alignItems="flex-start" justifyContent="center" direction="row">
        <Input
          fontSize="0.9rem"
          type="text"
          width="8.5vw"
          height="5vh"
          placeholder="Where do you live?"
          value={props.personal.livingPlace}
          fontWeight="600"
          onInput={(v) => updateField('livingPlace', v)}
        />
        <CustomSelect
          height="5vh"
          fontSize="0.8rem"
          fontWeight="600"
          width="8vw"
          backgroundColor={'rgba(255, 255, 255, 0.397)'}
          items={['Male', 'Female', 'Prefer not to say']}
          borderRadius="5px"
          onChange={(v) => updateField('gender', v)}
          value={props.personal.gender}
        />
      </FlexContainer>
      <FlexContainer gap="1rem" width="100%" height="auto" alignItems="center" justifyContent="flex-start" direction="column">
        <Input
          fontSize="1rem"
          fontWeight="600"
          type="date"
          width="18vw"
          height="5vh"
          required
          value={props.personal.birthdayDate}
          onInput={(v) => updateField('birthdayDate', v)}
        />
      </FlexContainer>
      <Button
        icon="arrow_r"
        iconHeight='100%'
        iconAspectRatio='1/1'
        itemsJustifyPosition="center"
        itemsAlignPosition='center'
        fontSize="1.2rem"
        text="Next step"
        width="9vw"
        height="5vh"
        backgroundColor="#94a3c02c"
        type="submit"
        disabled={!isPersonalValid}
      />
    </form>
  );
}
export default PersonalStep;
