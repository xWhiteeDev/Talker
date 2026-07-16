import style from "./optionList.module.css";
import type { OptionalList } from "./types";
export default function OptionList({
  placeholderText,
  additionalStyle,
  onOptionChange,
}: OptionalList) {
  return (
    <div className={style.container} style={additionalStyle}>
      <input
        list="visibilityFor"
        placeholder={placeholderText}
        style={additionalStyle}
        onChange={(e) => {
          if (!onOptionChange) return
          onOptionChange(e.currentTarget.value);
        }}
      />
      <datalist id="visibilityFor">
        <option value="Friends" />
        <option value="Public" />
        <option value="Only me" />
        <option value="Specified friends" />
        <option value="Group" />
      </datalist>
    </div>
  );
}
