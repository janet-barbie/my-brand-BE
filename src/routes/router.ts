import Router, { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/signup",
 // passport.authenticate("signup", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("post");
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", async (err: any, user: any, info: any) => {
      try {
        if (err || !user) {
          const error = new Error("An error occurred.");

          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");

          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }
);
const users=router;
export default users;
