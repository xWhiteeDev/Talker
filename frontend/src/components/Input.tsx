import type { IInput } from "../interfaces/IInput";
import { fetchImage } from "../services/root";

export default function Input({ width, height, image, placeholder }: IInput) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "black",
        width: width,
        height: height,
      }}
    >
      <input
        style={{
          height: "100%",
          border: "none",
          outline: "none",
          background: "none",
          color: "white",
        }}
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}
