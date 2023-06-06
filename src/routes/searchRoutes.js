import express from "express";
import { searchAllPost } from "../services/searchServices";

const router = express.Router();

router.get('/post/search', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const post = await searchAllPost(req.query);
        res.send(post)
    } catch (error) {
        console.log("Lỗi tìm kiếm ");
        res.status(500).json({ error: 'Đã xảy ra lỗi' })
    }
})

export default router;