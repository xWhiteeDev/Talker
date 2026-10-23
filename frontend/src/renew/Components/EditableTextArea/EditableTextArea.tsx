import { useEffect, useRef, useState } from 'react';
import style from './EditableTextArea.module.css';
interface EditableTextAreaProps {
  placeholder?: string;
  max: number;
  placeholderFontSize?: string;
  placeholderFontWeight?: string;
  placeholderColor?: string;
  additionalStyle?: React.CSSProperties;
  onInput?(text: string): void;
  securedText?: string;
  width: string;
  height: string;
  backgroundColor: string;
}

export default function EditableTextArea({
  placeholder,
  placeholderFontSize,
  placeholderFontWeight,
  placeholderColor,
  max,
  securedText,
  onInput,
  width,
  height,
  backgroundColor,
}: EditableTextAreaProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if ((securedText === '' || securedText == undefined) && placeholderRef.current) {
      if (placeholderRef.current.textContent !== '') {
        placeholderRef.current.textContent = '';
        setIsEmpty(true);
      }
    }
  }, [securedText]);

  const handleInput = () => {
    if (placeholderRef.current) {
      const text = placeholderRef.current.textContent || '';
      setIsEmpty(text.trim().length === 0);
      onInput?.(text);
    }
  };

  return (
    <div style={{ overflowY: 'hidden', position: 'relative', width, height, backgroundColor }} className={style.container}>
      {isEmpty && !focused && (
        <span
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            color: placeholderColor,
            fontSize: placeholderFontSize,
            fontWeight: placeholderFontWeight,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {placeholder}
        </span>
      )}

      <div
        ref={placeholderRef}
        contentEditable={securedText ? (securedText !== undefined ? 'plaintext-only' : undefined) : 'plaintext-only'}
        onBeforeInput={(e) => {
          if (placeholderRef.current && placeholderRef.current.textContent.length > max) {
            e.preventDefault();
            return false;
          }
        }}
        style={{
          outline: 'none',
          border: 'none',
          overflowY: 'auto',
          color: 'black',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: '1.5em', // Zapewnia miejsce na jedną linijkę, gdy pole jest puste
          height: 'auto',
        }}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
