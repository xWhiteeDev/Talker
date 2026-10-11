interface ILogin {
  email: string;
  password: string;
}

interface ILoginResponse {
    id:number;
    status:TStatus
}

type TAccountStatus = 'unverified' | 'verified' | 'suspended'