import { Schema, model, Types } from "mongoose";

interface ILikes {
  blogId: any;
  email: string;
  userId: string;
  likes: boolean;
}
const LikesSchema = new Schema<ILikes>({
  blogId: {
    type: Types.ObjectId,
  },
  email: String,
  userId: String,
  likes: {
    type: Boolean,
    default: true,
  },
});

const Likes = model<ILikes>("Likes", LikesSchema);

export default Likes;
