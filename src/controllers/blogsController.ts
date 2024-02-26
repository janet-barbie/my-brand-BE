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
      res.status(404).json({
        error: valid.error.details[0].message,
      });
    }
    //check if blog title exists
    const blogTitle = await Post.findOne({ title: req.body.title });

    if (blogTitle) {
      console.log(blogTitle);
      return res.status(400).send({ error: "title already exists" });
    } else {
      if (req.file) {
        //const base64Image = req.file.buffer.toString("base64");
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(req.user);

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
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Post.findOne({ _id: id });
    if (!blog) {
      res.status(404).send({ error: "Blog doesn't exist!" });
      return;
    }
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateBlogs = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Post.findOne({ _id: id });
    if (!blog) {
      res.status(404).send({ error: "Blog doesn't exist!" });
      return;
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
    res.send(blog);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const blogs = await Post.find();
    res.send(blogs);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blogDelete = await Post.findByIdAndDelete(blogId);
    await Comment.deleteMany({ blog: blogId });
    if (!blogDelete) {
      return res.status(404).send({ error: "Blog not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

// imageUploadRouter.post(
//   "/upload",
//   upload.array("images", 5),
//   uploadToCloudinary,
//   async (req: Request, res: Response) => {
//     try {
//       const cloudinaryUrls = req.body.cloudinaryUrls;
//       if (cloudinaryUrls.length === 0) {
//         console.error("No Cloudinary URLs found.");
//         return res.status(500).send("Internal Server Error");
//       }
//       const images = cloudinaryUrls;
//       return res.send(images);
//     } catch (error) {
//       return res.status(500).json({ error });
//     }
//   }
// );
