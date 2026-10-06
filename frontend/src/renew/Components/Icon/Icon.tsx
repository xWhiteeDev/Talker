import { icons, type IconName } from '.';
interface IIconProps {
  name: IconName;
  className?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
  onHover?: (name: string) => void;
}

export function Icon({ name, className, width, height, aspectRatio, onHover }: IIconProps) {
  const Component = icons[name];
  return (
    <img
      src={Component}
      onMouseEnter={() => {
        if (onHover) onHover(name);
      }}
      width={width}
      height={height}
      className={className}
      style={{ aspectRatio, cursor: 'pointer' }}
    />
  );
}
