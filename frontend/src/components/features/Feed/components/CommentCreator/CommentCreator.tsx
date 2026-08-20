import Button from '../../../../generic/UI/Button/Button';
import EditableTextArea from '../../../../generic/UI/EditableTextArea/EditableTextArea';
import style from './CommentCreator.module.css';

interface CommentCreatorProps {
  onSubmit(): void;
  onEditableTextAreaChange?(text: string): void;
  text: string;
}

export default function CommentCreator({ onSubmit, text, onEditableTextAreaChange }: CommentCreatorProps) {
  return (
    <div className={style.container}>
      <EditableTextArea
        max={255}
        placeholder="+ Add comment"
        placeholderFontWeight="600"
        placeholderFontSize="1rem"
        additionalStyle={{ height: 'auto', padding: '0.4em' }}
        onInput={(text) => onEditableTextAreaChange && onEditableTextAreaChange(text)}
      />
      {text && text.length > 0 && (
        <Button
          text="Add comment"
          additionalStyle={{
            width: '18%',
            border: 'none',
            backgroundColor: ' rgba(231, 236, 238, 0.18)',
            boxShadow: '2px 1px 2px 1.2px #71a0ccb0',
            color: 'rgb(49, 49, 49)',
            borderRadius: '10px',
            padding: '0.5rem',
          }}
          onClick={() => onSubmit()}
        />
      )}
    </div>
  );
}

