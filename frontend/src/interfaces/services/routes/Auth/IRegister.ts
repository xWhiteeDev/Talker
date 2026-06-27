export interface IRegisterInfo {
    email: string;
    firstName:string;
    lastName:string;
    password: string;
    date: string;
    sex?:string
}

export interface IRegisterFormData {
    email:string;
    firstName:string;
    lastName:string;
    password:string;
    birthdayDate:string;
    
}