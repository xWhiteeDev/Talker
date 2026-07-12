export interface FileOption {
    fileIcon: string,
    text: string,
    additionalStyle?:React.CSSProperties
    onClick?(arg:React.MouseEvent<HTMLDivElement,MouseEvent>): void
}