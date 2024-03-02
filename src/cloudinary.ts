import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with your credentials

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});
const picture = "./src/images";
// cloudinary.uploader.upload(picture).then((result) => {
//   console.log(result);
// });
//const result=await cloudinary.uploader.upload(picture)
export default cloudinary;
