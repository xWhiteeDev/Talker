import style from "./button.module.css";
import type { Button } from "./types";
export default function Button({
  text,
  onClick,
  isDisabled,
  type,
  additionalStyle,
}: Button) {
  return (
    <button
      className={style.global}
      type={type}
      style={{
        border: "2px solid #0202023f",
        outline: "none",
        ...additionalStyle,
      }}
      disabled={isDisabled}
      onClick={(e) => onClick?.(e)}
    >
      {text}
    </button>
  );
}
