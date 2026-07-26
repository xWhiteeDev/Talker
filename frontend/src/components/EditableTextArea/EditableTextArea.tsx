import { useRef, useState } from "react";
import type { EditableTextArea } from "./types";
export default function EditableTextArea({
  placeholder,
  placeholderFontSize,
  placeholderFontWeight,
  placeholderColor,
  additionalStyle,
  onInput,
}: EditableTextArea) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <div style={{ maxHeight: "100%", overflowY: "hidden" }}>
      <div
        ref={placeholderRef}
        contentEditable="plaintext-only"
        style={{
          outline: "none",
          border: "none",
          overflowY: "auto",
          ...additionalStyle,
        }}
        onInput={() => {
          if (placeholderRef.current) {
            onInput?.(placeholderRef.current.textContent);
          }
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      >

        {!focused && placeholderRef.current && placeholderRef.current.textContent.trim().length < 2 ? <span
              style={{
                color: placeholderColor,
                fontSize: placeholderFontSize,
                fontWeight: placeholderFontWeight,
              }}
            >
              {placeholder}
            </span> : '' }


      
      </div>
    </div>
  );
}
