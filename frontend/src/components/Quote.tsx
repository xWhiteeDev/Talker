import type { IQuote } from "../interfaces/components/IQuote";

export default function Quote({ size, weight, text }: IQuote) {
  return (
    <span
      style={{ fontFamily: "Ink free", fontWeight: weight, fontSize: size }}
    >
      {text}
    </span>
  );
}
