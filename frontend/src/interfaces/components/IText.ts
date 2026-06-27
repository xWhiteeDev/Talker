import type { CSSProperties } from "react";
import type React from "react";

export interface IText {
    text: string;
    align?: CSSProperties['textAlign']

    bottomText?: string;
    className?: string

    size?: string;
    weight?: string;
}

