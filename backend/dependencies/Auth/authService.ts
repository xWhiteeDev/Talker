import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {configDotenv} from 'dotenv';
import type {IAccountService} from '../Account/types.js';
import {ErrorHandler} from '../../handlers/errorHandler.js';
import type {IAuthService, ILogin, IServerAccountRegisterData, ISignInPayload} from './types.js';
import type {IPersonalService} from '../Personal/types.js';
import type {ICodeInsertDTO, ICodeService} from '../Code/types.js';
import {generateRandomCode} from '../../helpers/char.js';
import {ACCOUNT_CONFIG} from '../../configurations/account.config.js';
import type {IResend} from '../../services/Resend/type.js';
import {confirmationEmail} from '../../services/Resend/templates/email.template.js';

configDotenv();
export class AuthService implements IAuthService {
  constructor(private accountService: IAccountService, private personalService: IPersonalService, private codeService: ICodeService, private Emailer: IResend) {
  }
  async signIn(document: ILogin): Promise<ISignInPayload | null> {
    const existingUser = await this.accountService.findUserWithCredentials(document.email);
    if (!existingUser) {
      throw new ErrorHandler('Invalid data', 400);
    }
    const comparedPassword = await bcrypt.compare(document.password, existingUser.password);
    if (!comparedPassword) {
      throw new ErrorHandler('Invalid data', 400);
    }
    const existingPersonalRow = await this.personalService.getPersonal(existingUser.id);
    if (!existingPersonalRow) return null;
    const accessToken: string = jwt.sign(
      {id: existingUser.id, tokenType: 'access'},
      process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!,
      {expiresIn: '5m'},
    );
    const refreshToken: string = jwt.sign(
      {id: existingUser.id, tokenType: 'refresh'},
      process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!,
      {expiresIn: '7d'},
    );
    const userPayload: ISignInPayload = {
      personal: {
        id: existingPersonalRow.id,
        userId: existingPersonalRow.userId,
        firstName: existingPersonalRow.firstName,
        lastName: existingPersonalRow.lastName,
        birthDate: existingPersonalRow.birthDate,
        gender: existingPersonalRow.gender
      },
      account: {
        id: existingUser.id,
        status:existingUser.status
      },
      refreshToken: refreshToken,
      accessToken: accessToken
    };
    return userPayload;
  }
  async signUp(document: IServerAccountRegisterData): Promise<boolean> {
    const isAccountAlreadyExist: boolean = await this.accountService.isUserExist(document.account.email);
    if (isAccountAlreadyExist) return false;
    try {
      const insertId = await this.accountService.insertUser({email: document.account.email, password: document.account.password, status: 'unverified'});
      if (insertId == null) return false;
      const insertingPersonalities = await this.personalService.insertPersonal({
        user_id: insertId,
        first_name: document.personal.firstName,
        last_name: document.personal.lastName,
        birth_date: document.personal.birthdayDate,
        living_place: document.personal.livingPlace,
        gender: document.personal.gender
      });

      if (insertId == null || !insertingPersonalities) {
        return false;
      }
      const generatedCode = generateRandomCode(ACCOUNT_CONFIG.CODE.MAX);
      const codeInsertPayload: ICodeInsertDTO = {
        email: document.account.email,
        type: 'verification',
        code: generatedCode,
        expires_at: Date.now() + 5 * 60_000,
        attempts: 0
      };
      await this.codeService.insertCode(codeInsertPayload);
      const confirmation = confirmationEmail(generatedCode, 5);
      await this.Emailer.send(confirmation.subject, confirmation.html, confirmation.text, document.account.email.trim().toLowerCase());
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  signNewToken(userId: number, tokenType: 'access' | 'refresh'): string {
    const secret = {
      access: {secret: process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!, expiresIn: '5m' as const},
      refresh: {secret: process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!, expiresIn: '7d' as const},
    };
    const token = jwt.sign({id: userId, tokenType}, secret[tokenType].secret, {expiresIn: secret[tokenType].expiresIn});
    return token;
  }
  async isEmailTaken(email: string) {
    return (await this.accountService.isUserExist(email));
  }
  async isAuthorized(id: number): Promise<number | null> {
    const existingUser = await this.accountService.findUserById(id);
    return existingUser ? existingUser.id : null;
  }
}
