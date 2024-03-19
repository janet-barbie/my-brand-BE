//import Router from "express";
import Router, { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isAuthenticated, isAdmin } from "../middleware/userAuthentication";
//import router from express.Router;
import {
  getAll,
  newBlog,
  getBlog,
  updateBlogs,
  deleteBlog,
} from "../controllers/blogsController";
import {
  newQuery,
  getQuery,
  getQueries,
  deleteQuery,
} from "../controllers/queryController";
import {
  newComment,
  getComments,
  deleteComment,
} from "../controllers/commentsController";
import { newLike, getLikes } from "../controllers/likesController";
import multer, { Multer } from "multer";
import image from "../middleware/cloudinarymiddleware";
import { userSignupValidation } from "../middleware/userAuthentication";
const router = Router();

// Get all posts
router.get("/blogs", getAll);

// Create post
router.post("/blogs", image.single("profile"), isAdmin, newBlog);

// Getting single blog/post
router.get("/blogs/:id", getBlog);

// Update
router.patch("/blogs/:id", isAdmin, image.single("profile"), updateBlogs);

// Delete
router.delete("/blogs/:id", isAdmin, deleteBlog);
// post queries
router.post("/queries", newQuery);
// Get all queries
router.get("/queries", isAdmin, getQueries);
//get single query
router.get("/queries/:id", isAdmin, getQuery);
//delete query
// Delete
router.delete("/queries/:id", isAdmin, deleteQuery);
//post comment
router.post("/blogs/:id/comments", isAuthenticated, newComment);
//get  comment
router.get("/blogs/:id/comments/", getComments);
//delete comments
router.delete("/comments/:id", isAdmin, deleteComment);
// post a like
router.post("/blogs/:id/likes", isAuthenticated, newLike);
//get all likes
router.get("/blogs/:id/likes", getLikes);
//sign up
router.post(
  "/signup",
  userSignupValidation,
  passport.authenticate("signup", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("post");
    return res.status(200).json({
      message: "Signup successful",
      user: req.user,
    });
  }
);
//login up
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", async (err: any, user: any, info: any) => {
      try {
        if (err || !user) {
          console.log(info);
          const error = new Error("An error occurred.");

          return res.status(404).json(info);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email ,name:user.name};
          let token = jwt.sign({ user: body }, "TOP_SECRET");
          token = "Bearer " + token;

          return res.json({ token, user });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }
);
export default router;
