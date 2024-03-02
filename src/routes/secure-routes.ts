import express, { Request, Response, NextFunction } from "express";
const routes = express.Router();

routes.get("/profile", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "You made it to the secure route",
    user: (req as any).user,
    token: (req.query as any).secret_token,
  });
});

export default routes;
