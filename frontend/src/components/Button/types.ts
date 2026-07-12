import type React from "react";

export interface Button {
    text:string
    isDisabled?:boolean
    type?:'submit' | 'reset' | 'button'
    additionalStyle?:React.CSSProperties
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
