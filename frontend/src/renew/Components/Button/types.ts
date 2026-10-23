import type {ReactNode} from "react";
import type {TButtonType, TTextAlign, TFlexPosition} from "../../Interfaces/Unions";
import type {IconName} from "../Icon";

export interface IButtonProps {
  width?: string;
  height?: string;
  backgroundColor: string;
  submitFor?: string;
  text?: string | ReactNode;
  type?: TButtonType;
  color?: string;
  fontSize?: string;
  border?: string;
  fontWeight?: string;
  padding?: string;
  textAlign?: TTextAlign;
  form?: string;
  icon?: IconName;
  iconWidth?: string;
  iconHeight?: string;
  iconAspectRatio?: string;
  itemsAlignPosition?: TFlexPosition;
  itemsJustifyPosition?: TFlexPosition;
  gap?:string
  disabled?: boolean;
  withoutShadow?:boolean
  borderRadius?:string
  aspectRatio?:string
  onClick?: () => void;
}