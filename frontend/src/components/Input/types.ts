import type React from "react";

export interface Input {
    image?: string
    placeholder?: string;
    type?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (e: React.InputEvent<HTMLInputElement>) => void;
    onSubmit?: (e: React.SubmitEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    min?: number;
    max?: number;
    ref?: React.Ref<HTMLInputElement>
    list?: string
    isRequired?: boolean;
    name?: string;
    additionalStyle?: React.CSSProperties,
    placeholderSize?: string

}


export interface CSSPropertiesWithVars extends React.CSSProperties {
      "--placeholderSize"?: string;

}