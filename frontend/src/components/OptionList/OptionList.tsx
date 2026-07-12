import style from "./optionList.module.css";
import type { OptionalList } from "./types";
export default function OptionList({
  placeholderText,
  additionalStyle,
}: OptionalList) {
  return (
    <div className={style.container} style={additionalStyle}>
        <input
          list="cars"
          placeholder={placeholderText}
          style={additionalStyle}
        />
        <datalist id="cars">
          <option value="Friends" />
          <option value="Public" />
          <option value="Only me" />
          <option value="Specified friends" />
          <option value="Group" />
        </datalist>
    </div>
  );
}
