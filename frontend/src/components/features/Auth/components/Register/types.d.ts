interface IPersonal {
  firstName: string | null;
  lastName: string | null;
  livingPlace: string | null;
  gender: string;
  birthdayDate: string | null;
}

interface IAccount {
  email: string | null;
  password: string | null;
  repassword: string | null;
}
type TSteps = 'personal' | 'account' | 'confirmation';

export {IPersonal, IAccount, TSteps};