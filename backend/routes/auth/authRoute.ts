import express, {type Request} from 'express';
import {authController} from '../../loader/dependencyLoader.js';
import {isDataValid, isRefreshTokenValid, isAccessTokenActive} from '../../middleware/middleware.js';
import type {IObjectRequirements} from '../../services/types.js';
import {ACCOUNT_CONFIG} from '../../configurations/account.config.js';
import {PERSONAL_CONFIG} from '../../configurations/personal.config.js';

export const authRouter = express.Router();

const registerConfig: IObjectRequirements = {
  personal: {
    type: 'object',
    requirements: {
      firstName: {
        type: 'string',
        requirements: {
          minLength: PERSONAL_CONFIG.FIRST_NAME.MIN,
          maxLength: PERSONAL_CONFIG.FIRST_NAME.MAX,
          regex: PERSONAL_CONFIG.FIRST_NAME.REGEX,
          canBeNull: false

        }
      },
      lastName: {
        type: 'string',
        requirements: {
          minLength: PERSONAL_CONFIG.LAST_NAME.MIN,
          maxLength: PERSONAL_CONFIG.LAST_NAME.MAX,
          regex: PERSONAL_CONFIG.LAST_NAME.REGEX,
          canBeNull: false,
        }
      },
      livingPlace: {
        type: 'string',
        requirements: {
          minLength: PERSONAL_CONFIG.LIVING_PLACE.MIN,
          maxLength: PERSONAL_CONFIG.LIVING_PLACE.MAX,
          canBeNull: true
        }
      },
      birthdayDate: {
        type: 'date',
        requirements: {
          minAge:16,
          maxAge:99,
          canBeNull:true
        } //TODO: TO CHECK LATER
      },
      gender: {
        type: 'string',
        requirements: {
          canBeNull: true
        }
      }
    },
  }
};

const loginConfig: IObjectRequirements = {
  email: {
    type: 'string',
    requirements: {
      minLength: ACCOUNT_CONFIG.EMAIL.MIN,
      maxLength: ACCOUNT_CONFIG.EMAIL.MAX,
      regex: ACCOUNT_CONFIG.EMAIL.REGEX,
      canBeNull: false
    },
  },
  password: {
    type: 'string',
    requirements: {
      minLength: ACCOUNT_CONFIG.PASSWORD.MIN,
      maxLength: ACCOUNT_CONFIG.PASSWORD.MAX,
      canBeNull: false
    },
  },
};


authRouter.get('/', async (req, res, next) => {
  await authController.isEmailTaken(req, res, next);
});

authRouter.post('/signup', isDataValid(registerConfig), async (req, res, next) => {
  await authController.createUser(req, res, next);
});

authRouter.post('/signin',isDataValid(loginConfig), async (req, res, next) => {
  await authController.signIn(req, res, next);
});
authRouter.post('/logout', isAccessTokenActive(), async (_req, res, _next) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({success: true});
});
authRouter.post('/refresh', isRefreshTokenValid(), async (req, res, next) => {
  authController.createNewToken(req, res, next);
});
authRouter.get('/isAuth', isAccessTokenActive(), async (req: Request, res, next) => {
  await authController.isAuthorized(req, res, next);
});
