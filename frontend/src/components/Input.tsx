import { useEffect, useState } from "react";
import type { IInput } from "../interfaces/components/IInput";
import { fetchImage } from "../services/root";
import style from "../styles/components/input.module.css";
export default function Input({
  width,
  height,
  image,
  placeholder,
  onSubmit,
  onInput,
  onChange,
  type,
  max,
  min,
  ref,
}: IInput) {
  const [img, setImg] = useState<string>();
  useEffect(() => {
    if (!image) return;
    fetchImage(image).then((res) => {
      if (res) setImg(res);
    });
  }, [image]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgba(31, 31, 31, 0.45)",
        border: "1px solid black",
        width: width,
        height: height,
      }}
    >
      {image && (
        <img
          src={img}
          style={{ height: "90%", margin: "2%", aspectRatio: "1/1" }}
        />
      )}
      <input
        ref={ref}
        className={style.global}
        type={type}
        maxLength={max}
        minLength={min}
        placeholder={placeholder}
        onSubmit={(e) => onSubmit?.(e)}
        onChange={(e) => onChange?.(e)}
        onInput={(e) => onInput?.(e)}
      />
    </div>
  );
}
