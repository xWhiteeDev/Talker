import style from "./button.module.css";

interface ButtonProps {
  text: string;
  isDisabled?: boolean;
  type?: "submit" | "reset" | "button";
  additionalStyle?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Button({
  text,
  onClick,
  isDisabled,
  type,
  additionalStyle,
}: ButtonProps) {
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
