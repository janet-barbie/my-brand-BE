import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;
interface IComment {
  blogId: any;
  name: string;
  email: string;
  comment: string;
  userId: string;
}
const commentSchema = new Schema<IComment>({
  blogId: {
    type: Types.ObjectId,
    // ref: "posts",
  },
  name: String,
  email: String,
  comment: String,
  userId: String,
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
