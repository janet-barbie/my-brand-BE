import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
dotenv.config();
const port = process.env.PORT || 5000;
import app from "./app";
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

  .then(() => {
    console.log("server connected");
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }) //const PORT = process.env.PORT || 5000;
  .catch((error: any) => {
    console.error("Error connecting to the database:", error.message);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
