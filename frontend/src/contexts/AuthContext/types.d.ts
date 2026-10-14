export interface IAuthContext {
    user: IAuthorizedUser | undefined;
    setLogged(email: string, password: string): Promise<TLoginReturnUserState>;
    isLogin: boolean;
    logout(): void;
}

export interface IAuthLoginResponse {
    firstName: string;
    lastName: string;
    verified: TAccountStatus;
}
export interface IAuthorizedUser extends Omit<IAuthLoginResponse, 'verified'>  {}
export type TLoginReturnUserState = 'ok' | 'unverified' | 'suspended' | 'error';