import express from 'express';
import { isAccessTokenActive, isDataValid } from '../../middleware/middleware.js';
import { postController } from '../../loader/dependencyLoader.js';
import type { IObjectRequirements } from '../../services/types.js';

export const postRouter = express.Router();

const config: IObjectRequirements = {
  content: {
    type: 'string',
    requirements: {
      trimmed: true,
      minLength: 4,
      maxLength: 400,
    },
  },
  visible_for: {
    type: 'string',
    requirements: {
      minLength: 5,
      maxLength: 8,
      expectedValues:['Public', 'Private', 'Friends']
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
