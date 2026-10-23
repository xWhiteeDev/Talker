import { useRef, useState } from 'react';
import UserAvatar from '../../../../../../../Components/User/UserAvatar/UserAvatar';
import style from './PostCreator.module.css';
import EditableArea from '../../../../../../../Components/EditableArea/EditableArea';
import CustomText from '../../../../../../../Components/CustomText/CustomText';
import FlexContainer from '../../../../../../../Components/FlexContainer/FlexContainer';
import { Icon } from '../../../../../../../Components/Icon/Icon';
import Button from '../../../../../../../Components/Button/Button';
import type { IPost, TPostVisibility } from '../../../../../../../../types/components/IPost';
import { useAPI } from '../../../../../../../../hooks/useAPI';
import { Validify } from '../../../../../../../../services/Validify';
import type { IStringRequirements } from '../../../../../../../../services/types';
import { Icons } from '../../../../../../../Components/Icon';
import { useAuth } from '../../../../../../../../hooks/useAuth';
import {debugAvatar} from '../../../../../../../Assets/debug';

interface IPostCreatorProps {
  refresh():Promise<void>
}
interface IVisibilityIcon {
  visibilityType: TPostVisibility;
  icon: keyof typeof Icons;
}
const postValidateConfiguration: IStringRequirements = {
  minLength: import.meta.env.POST_MIN_LENGTH,
  maxLength: import.meta.env.POST_MAX_LENGTH,
  trimmed: true,
  canBeNull: false,
};

const visiblityIcons: IVisibilityIcon[] = [
  {
    visibilityType: 'public',
    icon: 'global',
  },
  {
    visibilityType: 'friends',
    icon: 'users',
  },
  {
    visibilityType: 'private',
    icon: 'locked',
  },
];

export default function PostCreator(props: IPostCreatorProps) {
  const [isActive, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [visibleIconsIndex, setVisibleIconsIndex] = useState<number>(0);
  const visibleType = useRef<TPostVisibility>('public');
  const { request } = useAPI();
  const { user } = useAuth();
  if (!user) {
    throw new Error('User not provided! Cannot do that operation');
  }
  const handlePublishPost = async () => {
    try {
      if (!text) return false;
      const isTextValid = Validify.validateString(text, postValidateConfiguration);
      if (!isTextValid) return false;
      const payload = {
        text: text,
        visibleFor: visibleType.current,
      };
      const result = await request<IPost>('/api/posts', 'POST', payload);
      if (result.success && result.data) {
        await props.refresh()
      } else {
        console.log('Post not added');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const incrementVisibleState = (visibleIcons: IVisibilityIcon[], current: number) => {
    let index = current + 1;
    if (!visibleIcons[index]) {
      index = 0;
    }

    setVisibleIconsIndex(index);
    visibleType.current = visibleIcons[index].visibilityType;
  };
  return (
    <div className={style.container}>
      <FlexContainer width="100%" height="auto" gap="1rem">
        <div className={style.avatarContainer}>
          <UserAvatar
            avatarUrl={debugAvatar}
            height="5vh"
            aspectRatio="1/1"
            isRounded
          />
        </div>
        <div className={style.textArea}>
          <EditableArea
            width="100%"
            height="auto"
            maxHeight="25vh"
            onInput={(text) => {
              if (text && text?.length + 1 === 300) {
                return;
              }
              setText(text);
            }}
            setActive={setActive}
          />
          {(!isActive || !text) && (
            <CustomText
              pointerEvents="none"
              position="absolute"
              top="0"
              left="0"
              text={`What do you have on your mind, Jacob?`}
              fontSize="1.2rem"
            />
          )}
        </div>
      </FlexContainer>
      {text && (
        <FlexContainer width="100%" height="100%" direction="row" gap="1rem" alignItems="center">
          <CustomText text={`${text.length} / 300`} fontSize="0.9rem" fontWeight="600" />
          <Icon name="photo_upload" width="23vw" aspectRatio="1/1" />
          <Icon name="pin_place" width="23vw" aspectRatio="1/1" />
          <Icon name="tag" width="23vw" aspectRatio="1/1" />
          <Icon name="gif" width="23vw" aspectRatio="1/1" />
          <Icon
            name={visiblityIcons[visibleIconsIndex].icon}
            width="23vw"
            aspectRatio="1/1"
            onClick={() => incrementVisibleState(visiblityIcons, visibleIconsIndex)}
            backgroundColor="gray"
            padding="0.1rem"
            borderRadius="50%"
          />

          <Button
            text="Publish"
            withoutShadow
            fontSize="1rem"
            backgroundColor="white"
            border="1px solid gray"
            fontWeight="600"
            borderRadius="15px"
            padding="0.4rem"
            disabled={text.length > 300}
            onClick={handlePublishPost}
          />
        </FlexContainer>
      )}
    </div>
  );
}
