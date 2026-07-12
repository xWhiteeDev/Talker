import { useRef, useState } from "react";
import type {EditableTextArea} from './types'
export default function EditableTextArea({
  placeholder,
  placeholderFontSize,
  placeholderFontWeight,
  placeholderColor,
  additionalStyle
}: EditableTextArea) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <div
      style={{ maxHeight:"100%", width: "auto", minWidth: "40%", marginLeft:"2%",overflowY:'auto' }}
    >
      {!focused &&
      (!ref.current ||
        (ref.current && ref.current.textContent.trim().length == 0)) ? (
        <span  style={{ position: "absolute", zIndex: -1,color:placeholderColor,fontSize:placeholderFontSize,fontWeight:placeholderFontWeight }}>{placeholder}</span>
      ) : (
        ""
      )}
      <div
        ref={ref}
        contentEditable="plaintext-only"
        style={{
          outline: "none",
          border: "none",
          overflowY:'auto',
          ...additionalStyle
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      ></div>
    </div>
  );
}
