import type {TTextAlign} from "../../Interfaces/Unions";

interface ICustomTextProps {
  text: React.ReactNode | string;
  color: string;
  fontSize?: string;
  fontWeight?: string;
  textShadow?:string;
  textAlign?: TTextAlign
  className?:string
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
      className={props.className}
    >
      {props.text}
    </span>
  );
}
export default CustomText;
