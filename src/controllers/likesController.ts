import { Request, Response } from "express";
import Likes from "../models/likes";
import { IUser } from "../models/model";

export const newLike = async (req: Request, res: Response) => {
  //const { blogId, email } = req.body;
  try {
    if (req.user) {
      const user = req.user as IUser;
      //console.log(req)
      const bloglikes: any = await Likes.findOne({
        blogId: req.params.id,
        userId: user._id,
      });
      
      console.log(bloglikes)
      if (bloglikes) {
    
        bloglikes.likes = !bloglikes.likes;
        
        await bloglikes.save();
        //return res.send(bloglikes);
        const total = await Likes.countDocuments({
          blogId: req.params.id,
          likes: true,
        });
        const dislike = await Likes.countDocuments({
          blogId: req.params.id,
          likes: false,
        });
        return res.status(200).json({ bloglikes,total,dislike});
       } 
       else {
        const bloglikes = new Likes({
       blogId: req.params.id,
           userId: user._id,
      email: user.email,
        });
        await bloglikes.save();
        const total = await Likes.countDocuments({
          blogId: req.params.id,
          likes: true,
        });
        const dislike = await Likes.countDocuments({
          blogId: req.params.id,
          likes: false,
        });
      
        console.log(req.user);
        return res.status(200).json({ bloglikes,total,dislike});
      }
     
      // res.send(bloglikes);
      const total = await Likes.countDocuments({
        blogId: req.params.id,
        likes: true,
      });
      const dislike = await Likes.countDocuments({
        blogId: req.params.id,
        likes: false,
      });
      return res.status(200).json({ bloglikes,total,dislike});
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getLikes = async (req: Request, res: Response) => {
  try {
    const bloglike = await Likes.find();
    // res.send(bloglike);
    const total = await Likes.countDocuments({
      blogId: req.params.id,
      likes: true,
    });
    const dislike = await Likes.countDocuments({
      blogId: req.params.id,
      likes: false,
    });
    return res.status(200).json({ bloglike, total, dislike });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
