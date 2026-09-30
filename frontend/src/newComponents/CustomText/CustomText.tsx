interface ICustomTextProps {
  text: any;
  withShadow?: boolean;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  bolderText?:string[]
}

function CustomText(props: ICustomTextProps) {
  return (
    <span
      style={{
        color: props.color ?? 'black',
        fontSize: props.fontSize ?? '1rem',
        fontWeight: props.fontWeight ?? '500',
        textShadow: props.withShadow ? `5px 4px 4px${props.color}` : '',
      }}
    >
      {props.text}
    </span>
  );
}
export default CustomText;
