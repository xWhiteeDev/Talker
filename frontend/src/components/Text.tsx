import type { IText } from "../interfaces/components/IText";

export default function CustomText({
  text,
  bottomText,
  weight,
  size,
  className,
  align,
}: IText) {
  return (
    <span
      className={className}
      style={{
        fontWeight: weight,
        fontSize: size,
        textAlign: align,
        fontFamily:
          "Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif",
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
