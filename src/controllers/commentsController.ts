import { Request, Response } from "express";
import Comment from "../models/comments";
import { validateComment } from "../validation";
import { IUser } from "../models/model";

export const newComment = async (req: Request, res: Response) => {
  const { name, comment } = req.body;
  const user = req.user as IUser;
  // const { userId, email } = req.user;
  try {
    const valid = validateComment(req.body);
    if (valid.error) {
      res.status(404).json({
        error: valid.error.details[0].message,
      });
    }
    console.log(req.body);
    const comments = new Comment({
      blogId: req.params.id,
      name,
      userId: user._id,
      email: user.email,
      comment,
    });
    await comments.save();
    //res.send(comments);
    return res.status(200).json({ comments });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.find({ blogId: req.params.id });
    res.send(comment);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.deleteOne({ _id: id });
    if (deletedComment.deletedCount === 0) {
      res.status(404).send({ error: "comment doesn't exist!" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
