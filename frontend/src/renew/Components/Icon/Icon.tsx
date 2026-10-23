import { Icons, type IconName } from './index';
interface IIconProps {
  name: IconName;
  className?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
  onClick?(name: string): void;
  onHover?(name: string): void;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
}

export function Icon({
  name,
  className,
  width,
  height,
  aspectRatio,
  onHover,
  onClick,
  backgroundColor,
  padding,
  borderRadius,
}: IIconProps) {
  const Component = Icons[name];
  return (
    <img
      src={Component}
      onMouseEnter={() => {
        if (onHover) onHover(name);
      }}
      onClick={() => onClick && onClick(name)}
      width={width}
      height={height}
      className={className}
      style={{ aspectRatio, cursor: 'pointer', backgroundColor, borderRadius, padding }}
    />
  );
}
