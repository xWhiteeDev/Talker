import { icons, type IconName } from '.';
interface IIconProps {
  name: IconName;
  className?: string;
  width?:string
  height?:string;
  aspectRatio?:string;
}

export function Icon({ name, className,width,height,aspectRatio }: IIconProps) {
  const Component = icons[name];
  return <img src={Component} width={width} height={height} className={className} style={{aspectRatio}} />;
}
