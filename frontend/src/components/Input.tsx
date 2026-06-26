import { useEffect, useState } from "react";
import type { IInput } from "../interfaces/components/IInput";
import { fetchImage } from "../services/root";
import style from '../styles/components/input.module.css'
export default function Input({ width, height, image, placeholder, onSubmit,onInput,onChange,type, max,min }: IInput) {
  const [img, setImg] = useState<string>();
  if (image) {
    useEffect(() => {
      fetchImage(image).then((res) => {
        if (res) {
          setImg(res);
        }
      });
    }, []);
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgba(31, 31, 31, 0.61)",
        width: width,
        height: height,
      }}
    >
      {image && <img src={img} style={{height:"90%", margin:"2%", aspectRatio:"1/1"}} />}
      <input
        className={style.global}
        type={type}
        maxLength={max}
        minLength={min}
        placeholder={placeholder}
        onSubmit={onSubmit}
        onChange={onChange}
        onInput={onInput}
      />
    </div>
  );
}
