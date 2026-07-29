import { useRef, useState } from "react";
import type { EditableTextArea } from "./types";

export default function EditableTextArea({
  placeholder,
  placeholderFontSize,
  placeholderFontWeight,
  placeholderColor,
  additionalStyle,
  max,
  onInput,
}: EditableTextArea) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const handleInput = () => {
    if (placeholderRef.current) {
      const text = placeholderRef.current.textContent || "";
      setIsEmpty(text.trim().length === 0);
      onInput?.(text);
    }
  };

  return (
    <div style={{ overflowY: "hidden" }}>
      {isEmpty && !focused && (
        <span
          style={{
            display: "block",
            transform: "translate(5%,50%)",
            position: "absolute",
            pointerEvents: "none",
            color: placeholderColor,
            fontSize: placeholderFontSize,
            fontWeight: placeholderFontWeight,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {placeholder}
        </span>
      )}

      <div
        ref={placeholderRef}
        contentEditable="plaintext-only"
        onBeforeInput={(e)=> {
          if (placeholderRef.current &&  placeholderRef.current.textContent.length > max) {
            e.preventDefault();
            return false
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
