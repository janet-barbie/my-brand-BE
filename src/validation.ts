import Joi from "joi";
export interface IPost {
  title: string;
  // image: string;
  intro: string;
  article: string;
}
export const validatePostData = (post: IPost) => {
  const PostSchema = Joi.object({
    title: Joi.string().min(5).max(15).required(),
    //image: Joi.string().required(),
    intro: Joi.string().min(5).max(30).required(),
    article: Joi.string().required(),
  });
  return PostSchema.validate(post);
};
export interface IComment {
  name: string;
  //email: string;
  comment: string;
}

export const validateComment = (comment: IComment) => {
  const commentSchema = Joi.object({
    // blogId: Joi.any(),
    name: Joi.string().required(),
    // email: Joi.string().email().required(),
    comment: Joi.string().required(),
  });
  return commentSchema.validate(comment);
};
export interface IQuery {
  name: string;
  email: string;
  message: string;
}
export const validateQuery = (query: IQuery) => {
  const querySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(5).max(30).required(),
  });
  return querySchema.validate(query);
};
