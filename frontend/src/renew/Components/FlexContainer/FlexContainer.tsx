import type { TFlexDirection, TFlexPosition, TPositionUnion } from '../../Interfaces/Unions';

interface IContainerProps {
  width: string;
  height: string;
  position?: TPositionUnion;
  justifyContent?: TFlexPosition;
  direction?: TFlexDirection;
  alignItems?: TFlexPosition;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  margin?: string;
  minHeight?: string;
  maxHeight?: string;
  borderLeft?: string;
  overflowY?: React.CSSProperties['overflowY'];
  children?: any;
}

function FlexContainer({
  width,
  margin,
  height,
  position,
  children,
  backgroundColor,
  justifyContent,
  alignItems,
  gap,
  direction,
  padding,
  borderRadius,
  border,
  minHeight,
  maxHeight,
  borderLeft,
  overflowY,
}: IContainerProps) {
  return (
    <div
      style={{
        gap,
        width,
        margin,
        height,
        position,
        backgroundColor,
        display: 'flex',
        justifyContent,
        alignItems,
        flexDirection: direction,
        padding,
        borderRadius,
        border,
        minHeight,
        maxHeight,
        borderLeft,
        overflowY: overflowY,
      }}
    >
      {children}
    </div>
  );
}
export default FlexContainer;
