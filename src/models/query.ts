import mongoose from "mongoose";

const { Schema, model } = mongoose;
interface IQuery {
  name: string;
  email: string;
  message: string;
}
const querySchema = new Schema<IQuery>({
  name: String,
  email: String,
  message: String,
});

const Query = model<IQuery>("Query", querySchema);

export default Query;
