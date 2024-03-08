import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/routes";
import auth from "./auth/auth";
import routes from "./routes/secure-routes";
import users from "./routes/routes";
import cors from "cors";
dotenv.config();

const app: Express = express();

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
//const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", router);
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth.initialize());
app.use("/api/secure-routes", routes);

app.use("/api/users", users);
export default app;
