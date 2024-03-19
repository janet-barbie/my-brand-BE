import Router, { Request, Response, NextFunction } from "express";
import passport from "passport";
import UserModel from "../models/model";
import {validateUser} from "../validation"

export const isAuthenticated = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error: any, token: any) => {
      if (error || !token) {
        return res
          .status(401)
          .json({
            message: "Unauthenticated user detected. Please login to continue",
          });
      }
      req.user = token;
      console.log( "good",req.user );
      return next();
    }
  )(req, res, next);
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error: any, user: any) => {
      if (error || !user) {
        return res
          .status(401)
          .json({
            message: "Unauthenticated user detected. Please login to continue",
          });
      }
      try {
        // console.log(user)
        req.user = user;
        const logedUser = await UserModel.findOne({ email: user.email });

        if (!logedUser)
          return res
            .status(401)
            .json({ error: "user not found please try again" });
        const role = logedUser.role;
        if (role !== "admin") {
          return res
            .status(401)
            .json({ error: "you are not allowed to perform this operation" });
        }
      } catch (error) {
        next(error);
      }
      return next();
    }
  )(req, res, next);
};

  export const userSignupValidation =(req:Request,res:Response,next:NextFunction)=>{
  // {name,email,password}=req.body
  const validUser=validateUser(req.body)
  console.log(req.body)
  console.log(validUser)
        if (validUser.error) {
         return res.status(400).json({
             error: validUser.error.details[0].message,
           });
      
}
return  next()
}