import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = Schema({
  title: {
    type: String,
    required: [true, "Vui lòng nhập tiêu đề bài viết"],
  },
  content: {
    type: String,
    required: [true, "Vui lòng nhập nội dung bài viết"],
  },
  imagePath: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model("Post", postSchema);
