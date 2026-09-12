import express, { type Request } from 'express';
import { authController } from '../../loader/dependencyLoader.js';
import { isDataValid, isRefreshTokenValid, isAccessTokenActive } from '../../middleware/middleware.js';
import type { IObjectRequirements } from '../../services/types.js';

export const authRouter = express.Router();

const registerConfig: IObjectRequirements = {
  email: {
    type: 'string',
    requirements: {
      minLength: 5,
      maxLength: 100,
    },
  },
  password: {
    type: 'string',
    requirements: {
      minLength: 5,
      maxLength: 100,
    },
  },
  firstName: {
    type: 'string',
    requirements: {
      minLength: 2,
      maxLength: 34,
    },
  },
  lastName: {
    type: 'string',
    requirements: {
      minLength: 2,
      maxLength: 34,
    },
  },
};

const loginConfig: IObjectRequirements = {
  email: {
    type: 'string',
    requirements: {
      minLength: 6,
      maxLength: 100,
    },
  },
  password: {
    type: 'string',
    requirements: {
      minLength: 5,
      maxLength: 100,
    },
  },
};

authRouter.post('/register', isDataValid(registerConfig), async (req, res, next) => {
  await authController.createUser(req, res, next);
});

authRouter.post('/login', isDataValid(loginConfig), async (req, res, next) => {
  await authController.signIn(req, res, next);
});
authRouter.post('/refresh', isRefreshTokenValid(), async (req, res, next) => {
  authController.createNewToken(req, res, next);
});
authRouter.get('/isAuth', isAccessTokenActive(), async (req: Request, res, next) => {
  await authController.isAuthorized(req, res, next);
});
