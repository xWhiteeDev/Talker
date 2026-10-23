import type React from "react";

export interface IWindowProps extends React.CSSProperties {
    children?:React.ReactNode;
    withShadow?:boolean
    description?:string
}