import style from "./optionList.module.css";
import type { OptionalList } from "./types";
export default function OptionList({
  placeholderText,
  additionalStyle,
  itemsList,
  onOptionChange,
}: OptionalList) {
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
