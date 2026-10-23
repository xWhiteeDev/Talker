export interface IAuthContext {
    user: IAuthorizedUser | undefined;
    setLogged(email: string, password: string): Promise<IAuthorizationResult>;
    isLogin: boolean;
    isLoading: boolean;
    logout(): Promise<boolean>;
    setUser(data: IAuthorizedUser | undefined): void;
    setLoginState(state:boolean) : void
}

export interface IAuthLoginResponse {
    firstName: string;
    lastName: string;
    avatarUrl:string
    verified: TAccountStatus;
    welcomeSeen: boolean;
}
export interface IAuthorizedUser extends Omit<IAuthLoginResponse, 'verified'> { }
export interface IAuthorizationResult {
    status: TLoginReturnUserState;
    welcomeSeen?: boolean;
}
export type TLoginReturnUserState = 'ok' | 'unverified' | 'suspended' | 'error';