export interface OptionalList {
    placeholderText: string;
    additionalStyle?: React.CSSProperties;
    onOptionChange?(value: string): void;
}