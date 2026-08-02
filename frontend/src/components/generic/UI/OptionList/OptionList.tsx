import style from "./optionList.module.css";

interface OptionListProps {
    placeholderText: string;
    itemsList:string[]
    additionalStyle?: React.CSSProperties;
    onOptionChange?(value: string): void;
}
export default function OptionList({
  placeholderText,
  additionalStyle,
  itemsList,
  onOptionChange,
}: OptionListProps) {
  return (
    <div className={style.container} style={additionalStyle}>
      <input
        list="visibilityFor"
        placeholder={placeholderText}
        style={additionalStyle}
        onChange={(e) => {
          if (!onOptionChange) return;
          onOptionChange(e.currentTarget.value);
        }}
      />
      <datalist id="visibilityFor">
        {itemsList && itemsList.map((v) => <option value={v} />)}
      </datalist>
    </div>
  );
}
