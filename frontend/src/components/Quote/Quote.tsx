import type { Quote } from "./types";

export default function Quote({ text,additionalStyle }: Quote) {
  return (
    <span
      style={{ fontFamily: "Ink free", ...additionalStyle}}
    >
      {text}
    </span>
  );
}
