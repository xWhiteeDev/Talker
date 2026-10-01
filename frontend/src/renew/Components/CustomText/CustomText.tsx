interface ICustomTextProps {
  text: any;
  withShadow?: boolean;
  color: string;
  fontSize?: string;
  fontWeight?: string;
  bolderText?:string[];
  textShadow?:string
}

function CustomText(props: ICustomTextProps) {
  return (
    <span
      style={{
        color: props.color,
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
