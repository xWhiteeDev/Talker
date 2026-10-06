import {PARAMETERS_REQUIREMENTS} from "../../../../../cfg";
import {Validify} from "../../../../../services/Validify";
import type {IAccount, IPersonal} from "./types";

export function getAge(birthdayDate: Date, currentDate: Date) {
    let age = currentDate.getFullYear() - birthdayDate.getFullYear();
    const birthdayMonth = birthdayDate.getMonth() + 1;
    const birthdayDay = birthdayDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const hadBirthday = (currentMonth > birthdayMonth) || (currentMonth === birthdayMonth && currentDay >= birthdayDay);
    if (!hadBirthday) age--;
    return age;
}


export function isPersonalDataValid(data: IPersonal) {
    return (Validify.validateString(data.firstName, {
        minLength: PARAMETERS_REQUIREMENTS.PERSONAL.FIRST_NAME.MIN,
        maxLength: PARAMETERS_REQUIREMENTS.PERSONAL.FIRST_NAME.MAX,
        canBeNull: false,
        regex: /^[^0-9]*$/,
    }) && Validify.validateString(data.lastName, {
        minLength: PARAMETERS_REQUIREMENTS.PERSONAL.LAST_NAME.MIN,
        maxLength: PARAMETERS_REQUIREMENTS.PERSONAL.LAST_NAME.MAX,
        canBeNull: false,
        regex: /^[^0-9]*$/,
    }) && data.livingPlace != undefined && data.gender != undefined && data.birthdayDate != undefined && getAge(new Date(data.birthdayDate), new Date()) >= PARAMETERS_REQUIREMENTS.MIN_AGE && getAge(new Date(data.birthdayDate), new Date()) <= 99);
}


export function isAccountDataValid(data: IAccount) {
    return !!(
        Validify.validateString(data.email, {
            minLength: PARAMETERS_REQUIREMENTS.EMAIL.MIN,
            maxLength: PARAMETERS_REQUIREMENTS.EMAIL.MAX,
            trimmed: true,
            regex: /[^@]+@[^@]+\.[^@]+/
        }) &&
        Validify.validateString(data.password, {
            minLength: PARAMETERS_REQUIREMENTS.PASSWORD.MIN,
            maxLength: PARAMETERS_REQUIREMENTS.PASSWORD.MAX,
            trimmed: true,
        }) &&
        Validify.validateString(data.repassword, {
            minLength: PARAMETERS_REQUIREMENTS.PASSWORD.MIN,
            maxLength: PARAMETERS_REQUIREMENTS.PASSWORD.MAX,
            trimmed: true,
        }) && Validify.validateString(data.password, {expectedValues: [data.repassword]})
    );
}

