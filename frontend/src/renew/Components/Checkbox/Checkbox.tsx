import style from './Checkbox.module.css';

interface ICheckboxProps {
  text?: string;
  fontSize?:string
}

function Checkbox(props: ICheckboxProps) {
  return (
    <div className={style.CheckboxContainer}>
      <input type="checkbox" />
      <span style={{fontSize:props.fontSize}}>{props.text}</span>
    </div>
  );
}
export default Checkbox;
