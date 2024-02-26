import { Request, Response } from "express";
import Likes from "../models/likes";
import { IUser } from "../models/model";

export const newLike = async (req: Request, res: Response) => {
  //const { blogId, email } = req.body;
  try {
    if (req.user) {
      const user = req.user as IUser;
      const bloglikes = await Likes.findOne({
        blogId: req.params.blogId,
        userId: user._id,
      });
      if (bloglikes) {
        bloglikes.likes = false;
        await bloglikes.save();
        //res.send(bloglikes);
        const total = await Likes.countDocuments({
          blogId: req.params.id,
          Likes: true,
        });
        const dislike = await Likes.countDocuments({
          blogId: req.params.id,
          Likes: false,
        });
        return res.status(200).json({ bloglikes, total, dislike });
      } else {
        const bloglikes = new Likes({
          blogId: req.params.id,
          userId: user._id,
          name: "",
          email: user.email,
        });
        await bloglikes.save();
        // res.send(bloglikes);
        const total = await Likes.countDocuments({
          blogId: req.params.id,
          Likes: true,
        });
        const dislike = await Likes.countDocuments({
          blogId: req.params.id,
          Likes: false,
        });
        return res.status(200).json({ bloglikes, total, dislike });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export const getLikes = async (req: Request, res: Response) => {
  try {
    const bloglike = await Likes.find();
    // res.send(bloglike);
    const total = await Likes.countDocuments({
      blogId: req.params.id,
      Likes: true,
    });
    const dislike = await Likes.countDocuments({
      blogId: req.params.id,
      Likes: false,
    });
    return res.status(200).json({ bloglike, total, dislike });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
