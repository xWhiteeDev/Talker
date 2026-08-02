export interface QuoteProps {
    text: string;
    additionalStyle?: React.CSSProperties
}
export default function Quote({ text,additionalStyle }: QuoteProps) {
  return (
    <span
      style={{ fontFamily: "Ink free", ...additionalStyle}}
    >
      {text}
    </span>
  );
}
