
export interface TextProps {
    text: string;
    bottomText?: string;
    className?: string
    additionalStyle?:React.CSSProperties

}


export default function CustomText({
  text,
  bottomText,
  className,
  additionalStyle,
}: TextProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily:
          "Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif",
        ...additionalStyle,
      }}
    >
      {text}{" "}
      {bottomText ? (
        <>
          <br />
          {bottomText}
        </>
      ) : (
        ""
      )}
    </span>
  );
}
