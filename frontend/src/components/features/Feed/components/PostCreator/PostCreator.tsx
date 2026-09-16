import Button from '../../../../generic/UI/Button/Button';
import EditableTextArea from '../../../../generic/UI/EditableTextArea/EditableTextArea';
import OptionList from '../../../../generic/UI/OptionList/OptionList';
import style from './PostCreator.module.css';

interface PostCreatorProps {
  onWrite?(text: string): void;
  onConfirm?(): void;
  onOptionChange?(option: string): void;
  text: string | undefined;
}

export function PostCreator({ onWrite, onConfirm, onOptionChange, text }: PostCreatorProps) {
  return (
    <div className={style.addPost}>
      {text && text.length > 0 ? (
        <OptionList
          placeholderText="Select visibility"
          itemsList={['Public', 'Friends', 'Private']}
          additionalStyle={{
            width: '7vw',
            margin: '2%',
            borderRadius: '5px',
          }}
          onOptionChange={(v) => onOptionChange && onOptionChange(v)}
        />
      ) : null}
      <EditableTextArea
        placeholderColor="black"
        placeholder={'+ Share something with world'}
        placeholderFontWeight="600"
        max={299}
        onInput={(text) => onWrite && onWrite(text)}
        additionalStyle={{
          padding: '2%',
          width: '29.5vw',
          maxWidth: '100%',
          minHeight: '1vh',
          color: 'black',
        }}
        securedText={text}
      />
      {text && text.length > 0 ? (
        <div className={style.postTools}>
          <span className={style.textLengthCounter} style={{ color: text.length > 299 ? 'red' : 'black' }}>
            {text.length} / {300}
          </span>
          <Button
            text="Add post"
            additionalStyle={{
              width: 'auto',
              border: 'none',
              justifySelf: 'center',
              alignSelf: 'center',
              padding: '0.5vh',
              backgroundColor: 'rgba(65, 199, 252, 0.432)',
              boxShadow: '2px 1px 2px 1.2px #71a0ccb0',
              color: 'rgb(49, 49, 49)',
              borderRadius: '5px',
              fontWeight: '600',
              height: '25%',
            }}
            onClick={async () => {
              if (onConfirm) onConfirm();
            }}
            isDisabled={text.length < 4}
          />
        </div>
      ) : null}
    </div>
  );
}
