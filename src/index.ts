import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/routes";
import auth from "./auth/auth";
import routes from "./routes/secure-routes";
import users from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
mongoose
  .connect(process.env.DB as string)
  .then(() => {
    //const app = express();
    app.use(express.json());
    app.use("/api", router);
    // app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(auth.initialize());
    app.use("/api/secure-routes", routes);

    app.use("/api/users", users);
    //this.httpServer.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("server connected");
  }) //const PORT = process.env.PORT || 5000;
  .catch((error: any) => {
    console.error("Error connecting to the database:", error.message);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
