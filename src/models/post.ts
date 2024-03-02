import mongoose from "mongoose";
const { Schema, model } = mongoose;

export interface IPost {
  title: string;
  image: string;
  intro: string;
  article: string;
}
const postSchema = new Schema<IPost>({
  title: String,
  image: String,
  intro: String,
  article: String,
});

const Post = model<IPost>("Post", postSchema);
//const Post = model("Post", postSchema);

export default Post;
