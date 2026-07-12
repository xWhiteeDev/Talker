import type { Text } from "./types";

export default function CustomText({
  text,
  bottomText,
  className,
  additionalStyle,
}: Text) {
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
