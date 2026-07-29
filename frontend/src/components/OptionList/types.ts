export interface OptionalList {
    placeholderText: string;
    itemsList:string[]
    additionalStyle?: React.CSSProperties;
    onOptionChange?(value: string): void;
}