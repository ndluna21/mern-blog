import Post from "./../models/post"

export const searchAllPost = async (params) => {
    console.log('----------params: ', params);
    return await Post.find({})
}