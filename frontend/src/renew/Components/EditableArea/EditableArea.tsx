import type { IEditableAreaProps } from './types';

export default function EditableArea(props: IEditableAreaProps) {
  return (
    <div
      contentEditable
      style={{
        ...props,
        cursor: 'pointer',
        outline: 'none',
        fontSize: '1.4rem',
      }}
      onFocus={() => {
        if (props.setActive) props.setActive(true);
      }}
      onInput={(e) => {
        if (props.onInput) {
          const content = e.currentTarget.textContent;
          if (content.trim().length === 0) {
            props.onInput(undefined);
            return;
          }
          props.onInput(content);
        }
      }}
    ></div>
  );
}
