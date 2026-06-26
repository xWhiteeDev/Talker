import type { IButton } from "../interfaces/components/IButton";
import style from "../styles/components/button.module.css";
export default function Button({
  text,
  width,
  height,
  aspectRatio,
  color,
  textColor,
  textAlignment,
  fontSize,
  onClick,
}: IButton) {
  return (
    <button
      className={style.global}
      style={{
        width,
        height,
        aspectRatio,
        backgroundColor: color,
        color: textColor,
        textAlign: textAlignment,
        border: "2px solid #0202023f",
        outline: "none",
        fontSize,
      }}
      onClick={(e) => onClick?.(e)}
    >
      {text}
    </button>
  );
}
