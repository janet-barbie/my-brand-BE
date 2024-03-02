import dotenv from "dotenv";
import multer, { Multer } from "multer";
const image = multer({
  storage: multer.diskStorage({
    filename: (req: any, file, cb) => {
      const uniqueFilename = Date.now() + "-" + file.originalname;
      cb(null, uniqueFilename);
    },
  }),
  fileFilter: (req: any, file, cb: any) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File is not supported"), false);
      return;
    }
  },
});
export default image;
