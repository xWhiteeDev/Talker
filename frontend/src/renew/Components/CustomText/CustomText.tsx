import type {TTextAlign} from "../../interfaces/Unions";

interface ICustomTextProps {
  text: React.ReactNode | string;
  color: string;
  fontSize?: string;
  fontWeight?: string;
  textShadow?:string;
  textAlign?: TTextAlign
}

function CustomText(props: ICustomTextProps) {
  return (
    <span
      style={{
        color: props.color,
        textAlign:props.textAlign,
        fontSize: props.fontSize ?? '1rem',
        fontWeight: props.fontWeight ?? '500',
        textShadow: props.textShadow,
      }}
    >
      {props.text}
    </span>
  );
}
export default CustomText;
