import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// paginate with this plugin
categorySchema.plugin(paginate);
export default mongoose.model("Cateogry", categorySchema);