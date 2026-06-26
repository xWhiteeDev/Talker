export interface IInput {
    width:string;
    height:string;
    image?:string
    placeholder?:string;
    type:string
    onChange?:(e: React.FormEvent<HTMLInputElement>) => void;
    onInput?:(e: React.FormEvent<HTMLInputElement>) => void;
    onSubmit?:(e: React.FormEvent<HTMLInputElement>)=> void;
    min?:number;
    max?:number
}