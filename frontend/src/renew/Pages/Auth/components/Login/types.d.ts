interface ILogin {
  email: string | null;
  password: string | null;
}
interface IUserPayload {
  firstName:string;
  lastName:string;
}
interface ILoginResponse {
  currentUserPayload:IUserPayload;
  verified:TAccountStatus
}

type TAccountStatus = 'unverified' | 'verified' | 'suspended';