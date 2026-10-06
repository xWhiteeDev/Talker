import type { TFlexDirection, TFlexPosition, TPositionUnion } from '../../Interfaces/Unions';

interface IContainerProps {
  width: string;
  height: string;
  position?: TPositionUnion;
  justifyContent?: TFlexPosition;
  direction?: TFlexDirection;
  alignItems?: TFlexPosition;
  gap?: string;
  backgroundColor?: string;
  children?: any;
}

function FlexContainer({ width, height, position, children, backgroundColor, justifyContent, alignItems, gap,direction }: IContainerProps) {
  return (
    <div style={{ gap, width, height, position, backgroundColor, display: 'flex', justifyContent, alignItems, flexDirection:direction }}>{children}</div>
  );
}
export default FlexContainer;
