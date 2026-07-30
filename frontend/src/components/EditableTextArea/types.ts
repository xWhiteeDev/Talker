export interface EditableTextArea {
    placeholder?: string;
    max:number;
    placeholderFontSize?: string,
    placeholderFontWeight?: string,
    placeholderColor?: string;
    additionalStyle?: React.CSSProperties;
    onInput?(text:string): void;
    securedText?:string

}