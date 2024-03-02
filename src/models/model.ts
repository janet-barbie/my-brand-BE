import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  role: string;
  email: string;
  password: string;
  // isValidPassword(password: string);
}

const UserSchema: Schema = new Schema({
  name: String,
  role: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});


const UserModel = mongoose.model<IUser>("user", UserSchema);

export default UserModel;
