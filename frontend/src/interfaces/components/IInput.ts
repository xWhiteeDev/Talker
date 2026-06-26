export interface IInput {
    width:string;
    height:string;
    image?:string
    placeholder?:string;
    type:string
    onChange?:() => void;
    onInput?:() => void;
    onSubmit?:()=> void
}