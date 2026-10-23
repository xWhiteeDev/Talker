import type React from "react";
import type {Icons} from "../Icon";

export interface IEditableAreaProps extends Omit<React.CSSProperties, 'display'> {
    placeholder?: string;
    icon?: keyof typeof Icons;
    onInput?(v: string | undefined): void;
    setActive?(state:boolean):void;
}