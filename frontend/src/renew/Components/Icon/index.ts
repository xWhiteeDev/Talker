import apple from '../../Assets/Icons/ico_apple.svg';
import arrow_r from '../../Assets/Icons/ico_arrow_r.svg';
import circle_plus from '../../Assets/Icons/ico_circle_plus.svg';
import email from '../../Assets/Icons/ico_email.svg';

import google from '../../Assets/Icons/ico_google.svg';
import home from '../../Assets/Icons/ico_home.svg';
import password from '../../Assets/Icons/ico_password.svg';
import phone from '../../Assets/Icons/ico_phone.svg';
import accept from '../../Assets/Icons/ico_accept.svg';
import arrow_flip from '../../Assets/Icons/ico_arrow_flip.svg';
import adventures from '../../Assets/Icons/ico_adventures.svg';
import chat from '../../Assets/Icons/ico_chat.svg';
import gift from '../../Assets/Icons/ico_gift.svg';
import group from '../../Assets/Icons/ico_group.svg';
import heart_chat from '../../Assets/Icons/ico_heart_chat.svg';
import news from '../../Assets/Icons/ico_news.svg';
import iphone from '../../Assets/Icons/ico_iphone.svg';
import add_user from '../../Assets/Icons/ico_add_user.svg';



export const icons = {add_user,apple, arrow_r, circle_plus, email, google, home, phone, password, arrow_flip, accept, adventures, chat, gift, group,heart_chat,news,iphone} as const; //TODO IN FUTURE REPLACE IT WITH DYNAMIC IMAGE FETCHING
export type IconName = keyof typeof icons;