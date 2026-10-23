import type { Icons } from '../Icon';
import Input from '../Input/Input';

interface ISearchbarProps {
  width: string;
  height: string;
  backgroundColor: string;
  borderRadius: string;
  placeholder: string;
  value: string | undefined;
  onInput(v: string): void;
  onConfirm(value: string): void;
  icon?: keyof typeof Icons;
}

export default function Searchbar(props: ISearchbarProps) {
  return (
    <Input
      type="text"
      onInput={props.onInput}
      value={props.value}
      fontSize="1.1rem"
      fontWeight="600"
      inputMode="search"
      iconAspectRatio="1/1"
      iconWidth="25vw"
      width={props.width}
      height={props.height}
      icon={props.icon}
      placeholder={props.placeholder}
      onConfirm={props.onConfirm}
      backgroundColor="white"
      borderRadius="10px"
    />
  );
}
