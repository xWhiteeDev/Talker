import express from "express";
import { isAccessTokenActive } from "../../middleware/middleware.js";
import {
  commentReactionController,
  postReactionController,
} from "../../loader/dependencyLoader.js";

export const postReactionRouter = express.Router();
export const commentReactionRouter = express.Router();

postReactionRouter.post("/", isAccessTokenActive(), async (req, res, next) => {
  await postReactionController.createReaction(req, res, next);
});

postReactionRouter.delete(
  "/",
  isAccessTokenActive(),
  async (req, res, next) => {
    await postReactionController.deleteReaction(req, res, next);
  },
);
//Comment routes

commentReactionRouter.post(
  "/",
  isAccessTokenActive(),
  async (req, res, next) => {
    await commentReactionController.createReaction(req, res, next);
  },
);
