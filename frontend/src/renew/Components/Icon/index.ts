import apple from '../../Assets/Icons/ico_apple.svg';
import arrow_r from '../../Assets/Icons/ico_arrow_r.svg';
import circle_plus from '../../Assets/Icons/ico_circle_plus.svg';
import email from '../../Assets/Icons/ico_email.svg';

import google from '../../Assets/Icons/ico_google.svg';
import home from '../../Assets/Icons/ico_home.svg';
import password from '../../Assets/Icons/ico_password.svg';
import phone from '../../Assets/Icons/ico_phone.svg';
import accept from '../../Assets/Icons/ico_accept.svg'
import arrow_flip from '../../Assets/Icons/ico_arrow_flip.svg'

export const icons = {apple, arrow_r, circle_plus, email, google, home, phone, password,arrow_flip,accept} as const; //TODO IN FUTURE REPLACE IT WITH DYNAMIC IMAGE FETCHING
export type IconName = keyof typeof icons