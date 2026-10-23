import type {TPostVisibility} from '../../../types/components/IPost';
import Button from '../Button/Button';
import CustomText from '../CustomText/CustomText';
import FlexContainer from '../FlexContainer/FlexContainer';
import type { IconName } from '../Icon';
import { Icon } from '../Icon/Icon';
import UserAvatar from '../User/UserAvatar/UserAvatar';
import style from './Post.module.css';


interface IPostProps {
  backgroundColor?: string;
  width: string;
  height: string;
  text: string;
  authorName: string;
  addedAt: string;
  for: TPostVisibility;
  avatarUrl: string;
}

const visibilityIcons: Record<TPostVisibility, IconName> = {
  public: 'global',
  friends: 'users',
  private: 'locked',
} as const;

export default function Post(props: IPostProps) {
  return (
    <div
      className={style.container}
      style={{ position: 'relative', backgroundColor: props.backgroundColor, width: props.width, height: props.height }}
    >
      <div className={style.optionsContainer}>
        <Button
          width="auto"
          height="auto"
          text="..."
          fontWeight="600"
          fontSize="1.2rem"
          color="black"
          withoutShadow
          backgroundColor="#ff000000"
        />
      </div>
      <FlexContainer width="100%" height="7vh" padding="0.2rem" direction="row" alignItems="center"  gap="0.4rem">
        <UserAvatar isRounded avatarUrl={props.avatarUrl} height="5vh" aspectRatio="1/1" />

        <FlexContainer width="25%" height="100%" direction="column" justifyContent="center">
          <CustomText text={props.authorName} color="black" fontWeight="600" fontSize="1rem" />
          <FlexContainer width="100%" height="auto" direction="row" gap="0.3rem">
            <CustomText text={props.addedAt} color="black" fontWeight="600" fontSize="0.9rem" />
            <Icon name={visibilityIcons[props.for]} width="13vw" aspectRatio="1/1" />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <div className={style.content}>
        <span>{props.text}</span>
      </div>
      <div className={style.interactions}>
        <div>
          <Button icon="heart" iconWidth="24vw" backgroundColor="#0000" withoutShadow iconAspectRatio="1/1" />
          <CustomText text="0" color="black" fontWeight="600" />
        </div>
        <div>
          <Button icon="messages" iconWidth="24vw" backgroundColor="#0000" withoutShadow iconAspectRatio="1/1" />
          <CustomText text="0" color="black" fontWeight="600" />
        </div>
        <div>
          <Button icon="saved" iconWidth="24vw" backgroundColor="#0000" withoutShadow iconAspectRatio="1/1" />
        </div>
      </div>
    </div>
  );
}
