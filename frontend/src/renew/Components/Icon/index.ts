import add_user from '../../Assets/Icons/ico_add_user.svg';
import apple from '../../Assets/Icons/ico_apple.svg';
import arrow_r from '../../Assets/Icons/ico_arrow_r.svg';
import circle_plus from '../../Assets/Icons/ico_circle_plus.svg';
import email from '../../Assets/Icons/ico_email.svg';
import google from '../../Assets/Icons/ico_google.svg';
import home from '../../Assets/Icons/ico_home.svg';
import phone from '../../Assets/Icons/ico_phone.svg';
import password from '../../Assets/Icons/ico_password.svg';
import arrow_flip from '../../Assets/Icons/ico_arrow_flip.svg';
import accept from '../../Assets/Icons/ico_accept.svg';
import adventures from '../../Assets/Icons/ico_adventures.svg';
import chat from '../../Assets/Icons/ico_chat.svg';
import gift from '../../Assets/Icons/ico_gift.svg';
import group from '../../Assets/Icons/ico_group.svg';
import heart_chat from '../../Assets/Icons/ico_heart_chat.svg';
import news from '../../Assets/Icons/ico_news.svg';
import iphone from '../../Assets/Icons/ico_iphone.svg';

import filter from '../../Assets/Icons/ico_filter.svg';
import global from '../../Assets/Icons/ico_global.svg';
import heart from '../../Assets/Icons/ico_heart.svg';
import locked from '../../Assets/Icons/ico_locked.svg';
import logout from '../../Assets/Icons/ico_logout.svg';
import magnifier from '../../Assets/Icons/ico_magnifier.svg';
import media from '../../Assets/Icons/ico_media.svg';
import messages from '../../Assets/Icons/ico_messages.svg';
import profile from '../../Assets/Icons/ico_profile.svg';
import saved from '../../Assets/Icons/ico_saved.svg';
import settings from '../../Assets/Icons/ico_settings.svg';
import users from '../../Assets/Icons/ico_users.svg';
import notification from '../../Assets/Icons/ico_notification.svg';
import add from '../../Assets/Icons/ico_add.svg';
import moon from '../../Assets/Icons/ico_moon.svg';
import sun from '../../Assets/Icons/ico_sun.svg';
import help from '../../Assets/Icons/ico_help.svg';
import normal_plus from '../../Assets/Icons/ico_normal_plus.svg';

import photo_upload from '../../Assets/Icons/ico_photo_upload.svg';
import pin_place from '../../Assets/Icons/ico_pin_place.svg';
import tag from '../../Assets/Icons/ico_tag_friends.svg';
import gif from '../../Assets/Icons/ico_gif.svg';

export const Icons = {
    add_user,
    apple,
    arrow_r,
    circle_plus,
    email,
    google,
    home,
    phone,
    password,
    arrow_flip,
    accept,
    adventures,
    chat,
    gift,
    group,
    heart_chat,
    news,
    iphone,
    filter,
    global,
    heart,
    locked,
    logout,
    magnifier,
    media,
    messages,
    profile,
    saved,
    settings,
    users,
    notification,
    add,
    help,
    moon,
    sun,
    normal_plus,
    pin_place,
    tag,
    photo_upload,
    gif
} as const;

export type IconName = keyof typeof Icons;