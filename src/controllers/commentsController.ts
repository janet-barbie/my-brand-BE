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
    return  res.status(403).json({
        error: valid.error.details[0].message,
      });
    }
    const comments = new Comment({
      blogId: req.params.id,
      name:user.name,
      userId: user._id,
      email: user.email,
      comment,
    });
    await comments.save();
    //res.send(comments);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id });
    // res.send(comment);
    return res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.deleteOne({ _id: id });
    if (deletedComment.deletedCount === 0) {
      return res.status(404).json({ error: "comment doesn't exist!" });
    }
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
