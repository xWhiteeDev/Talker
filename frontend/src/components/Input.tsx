import { useEffect, useState } from "react";
import type { IInput } from "../interfaces/components/IInput";
import { fetchImage } from "../services/root";

export default function Input({ width, height, image, placeholder }: IInput) {
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
        backgroundColor: "rgba(29, 29, 29, 0.48)",
        width: width,
        height: height,
      }}
    >
      {image && <img src={img} style={{height:"90%", margin:"2%", aspectRatio:"1/1"}} />}
      <input
        style={{
          height: "100%",
          border: "none",
          outline: "none",
          backgroundColor: "#ffffff00",
          color: "black",
          textIndent:"2%",
          fontSize:'1.1rem'
        }}
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}
