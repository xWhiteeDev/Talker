export interface IButton {
    width: string;
    height: string;
    text: string;
    color: string;
    textColor?: string;
    aspectRatio?: string
    textAlignment?: TextAlign;
    fontSize?: string;
    isDisabled?:boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type TextAlign = 'center' | 'start' | 'left' | 'end' | 'right' | '-webkit-center' | '-webkit-left' | '-webkit-match-parent'