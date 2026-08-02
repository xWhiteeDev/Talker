import { useEffect, useState } from "react";
import style from "./input.module.css";
import type {CSSPropertiesWithVars} from "../../../../types/CSSPropertiesWithVars";
import {fetchImage} from "../../../../services/fetchImageService";

interface InputProps {
  image?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.InputEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.SubmitEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  min?: number;
  max?: number;
  ref?: React.Ref<HTMLInputElement>;
  list?: string;
  isRequired?: boolean;
  name?: string;
  additionalStyle?: React.CSSProperties;
  placeholderSize?: string;
}



export default function Input({
  image,
  placeholder,
  onSubmit,
  onInput,
  onFocus,
  onChange,
  type,
  max,
  min,
  ref,
  list,
  isRequired,
  name,
  additionalStyle,
  placeholderSize,
}: InputProps) {
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
        ...additionalStyle,
      }}
    >
      {image && (
        <img
          src={img}
          style={{
            height: "100%",
            margin: "2%",
            aspectRatio: "1/1",
            flexShrink: 0,
            objectFit: "contain",
          }}
        />
      )}
      <input
        ref={ref}
        list={list}
        name={name}
        required={isRequired}
        className={style.global}
        type={type}
        maxLength={max}
        minLength={min}
        placeholder={placeholder}
        onSubmit={(e) => onSubmit?.(e)}
        onChange={(e) => onChange?.(e)}
        onInput={(e) => onInput?.(e)}
        style={{
          "--placeholderSize": placeholderSize,
          height: '50%',
          width: "85%",
        } as CSSPropertiesWithVars}
        onFocus={(e) => onFocus?.(e)}
      />
    </div>
  );
}
