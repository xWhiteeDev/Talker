import type React from "react";

export interface IActiveFriendsProps {
    children?:React.ReactNode
}

export interface IActiveUser {
    firstName:string;
    lastName:string;
    id:string;
}