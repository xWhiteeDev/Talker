import type { IText } from "../interfaces/components/IText";

export default function CustomText({
  text,
  bottomText,
  weight,
  size,
  className,
}: IText) {
  return (
    <span className={className} style={{ fontWeight: weight, fontSize: size }}>
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
