interface IPersonal {
  firstName: string;
  lastName: string;
  livingPlace: string;
  gender: string;
  birthdayDate: string;
}

interface IAccount {
  email: string | null;
  password: string | null;
  repassword: string | null;
}
type TSteps = 'personal' | 'account' | 'confirmation';

export {IPersonal,IAccount,TSteps}