interface ICustomSelect {
  width: string;
  height: string;
  fontSize: string;
  backgroundColor?: string;
  color?: string;
  items: string[];
  borderRadius?: string;
  boxShadow?: string;
  fontWeight?: string;
  onChange?(value: string): void;
  value: string;
}

function CustomSelect(props: ICustomSelect) {
  return (
    <select
      onChange={(v) => {
        if (props.onChange) props.onChange(v.currentTarget.value);
      }}
      value={props.value}
      name=""
      id=""
      style={{
        boxShadow: props.boxShadow,
        fontWeight: props.fontWeight,
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        border:'none',
        outline:'none',
        color: props.color,
        fontSize: props.fontSize,
        width: props.width,
        height: props.height,
      }}
    >
      {props.items.map((v, i) => (
        <option key={v + i} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}
export default CustomSelect;
