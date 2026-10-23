import express from 'express';
import { isAccessTokenActive, isDataValid } from '../../middleware/middleware.js';
import { postController } from '../../loader/dependencyLoader.js';
import type { IObjectRequirements } from '../../services/types.js';
import {configDotenv} from 'dotenv';

configDotenv()

export const postRouter = express.Router();

const config: IObjectRequirements = {
  text: {
    type: 'string',
    requirements: {
      trimmed: true,
      minLength: Number(process.env['POSTS_MIN_LENGTH'] ?? 4) ,
      maxLength: Number(process.env['POSTS_MAX_LENGTH'] ?? 300),
    },
  },
  visibleFor: {
    type: 'string',
    requirements: {
      minLength: 5,
      maxLength: 8,
      expectedValues:['public', 'private', 'friends']
    },
  },
};

postRouter.post('/', isDataValid(config), isAccessTokenActive(), async (req, res, next) => {
  await postController.insertNewPost(req, res, next);
});

postRouter.get('/', isAccessTokenActive(), async (req, res, next) => {
  await postController.fetchLatestPosts(req, res, next);
});
postRouter.get('/:id', isAccessTokenActive(), async (req, res, next) => {
  await postController.getSpecifiedPost(req, res, next);
});
