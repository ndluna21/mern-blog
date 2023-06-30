import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menuSchema = Schema({
    title: {
        type: String,
        required: [true, "Vui lòng nhập tên danh mục"],
    },
    createdAt: { type: Date, default: Date.now, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("Menu", menuSchema);
