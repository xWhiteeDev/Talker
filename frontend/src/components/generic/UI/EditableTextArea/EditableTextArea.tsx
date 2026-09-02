import { useEffect, useRef, useState } from "react";

interface EditableTextAreaProps {
    placeholder?: string;
    max:number;
    placeholderFontSize?: string,
    placeholderFontWeight?: string,
    placeholderColor?: string;
    additionalStyle?: React.CSSProperties;
    onInput?(text:string): void;
    securedText?:string

}

export default function EditableTextArea({
  placeholder,
  placeholderFontSize,
  placeholderFontWeight,
  placeholderColor,
  additionalStyle,
  max,
  securedText,
  onInput,
}: EditableTextAreaProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (
      (securedText === "" || securedText == undefined) &&
      placeholderRef.current
    ) {
      if (placeholderRef.current.textContent !== "") {
        placeholderRef.current.textContent = "";
        setIsEmpty(true);
      }
    }
  }, [securedText]);

  const handleInput = () => {
    if (placeholderRef.current) {
      const text = placeholderRef.current.textContent || "";
      setIsEmpty(text.trim().length === 0);
      onInput?.(text);
    }
  };

  return (
    <div style={{ overflowY: "hidden", position:'relative' }}>
      {isEmpty && !focused && (
        <span
          style={{
            position: "absolute",
            pointerEvents: "none",
            color: placeholderColor,
            fontSize: placeholderFontSize,
            fontWeight: placeholderFontWeight,
            userSelect: "none",
            whiteSpace: "nowrap",
                      ...additionalStyle,

          }}
        >
          {placeholder}
        </span>
      )}

      <div
        ref={placeholderRef}
        contentEditable={
          securedText
            ? securedText !== undefined
              ? "plaintext-only"
              : undefined
            : "plaintext-only"
        }
        content={securedText ?? undefined}
        onBeforeInput={(e) => {
          if (
            placeholderRef.current &&
            placeholderRef.current.textContent.length > max
          ) {
            e.preventDefault();
            return false;
          }
        }}
        style={{
          outline: "none",
          border: "none",
          overflowY: "auto",
          color: "black",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: "1.5em", // Zapewnia miejsce na jedną linijkę, gdy pole jest puste
          height: "auto",
          ...additionalStyle,
        }}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
