interface ILogin {
  email: string | null;
  password: string | null;
}
interface IUserPayload {
  id: number;
}
interface ILoginResponse {
  currentUserPayload:IUserPayload;
  verified:TAccountStatus
}

type TAccountStatus = 'unverified' | 'verified' | 'suspended';