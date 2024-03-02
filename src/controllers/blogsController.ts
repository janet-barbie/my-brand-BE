import { Request, Response } from "express";
import Post from "../models/post";
import Comment from "../models/comments";
import { validatePostData } from "../validation";
//import Post, { IPost } from "../models/post";
import cloudinary from "../cloudinary";
export const newBlog = async (req: Request, res: Response) => {
  const { title, intro, article } = req.body;
  try {
    const valid = validatePostData(req.body);
    if (valid.error) {
      return res.status(404).json({
        error: valid.error.details[0].message,
      });
    }
    //check if blog title exists
    const blogTitle = await Post.findOne({ title: req.body.title });

    if (blogTitle) {
      console.log(blogTitle);
      return res.status(400).json({ error: "title already exists" });
    } else {
      if (req.file) {
        //const base64Image = req.file.buffer.toString("base64");
        const result = await cloudinary.uploader.upload(req.file.path);
        
        const blog = new Post({
          title,
          image: result.secure_url,
          intro,
          article,
        });
        await blog.save();
        return res.status(200).json({ blog: blog });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Post.findOne({ _id: id });
    console.log(blog);
    if (!blog) {
      return res.status(404).json({ error: "Blog doesn't exist!" });
    }
    return res.status(200).json({ blog:blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBlogs = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Post.findOne({ _id: id });
    if (!blog) {
      return res.status(404).json({ error: "Blog doesn't exist!" });
    }

    //const { title, image, intro, article } = req.body;

    const { title, intro, article } = req.body;
    if (title) {
      blog.title = title;
    }
    // if (image) {
    //   blog.image = image;
    // }
    if (intro) {
      blog.intro = intro;
    }
    if (article) {
      blog.article = article;
    }
    await blog.save();
    // res.send(blog);
    return res.status(200).json({ blog: blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const blog = await Post.find();
    //res.send(blogs);
    return res.status(200).json({ blog: blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blogDelete = await Post.findByIdAndDelete(blogId);
    await Comment.deleteMany({ blog: blogId });
    if (!blogDelete) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
