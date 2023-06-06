import Post from "./../models/post";
import User from "./../models/user";
import Menu from "../models/menu";

export const getAllPosts = async (params) => {
  console.log('----------- params: ', params);
  return await Post.find({});
};

export const getOnePost = async (id) => {
  //find post
  const post = await Post.findById(id).populate({
    path: "comments",
    populate: {
      path: "createdBy",
    },
  });

  let res;
  if (post) {
    //get the name of the creator
    const user = await User.findById(post.createdBy);
    res = {
      ...post.toObject(),
      createdByName: user.userName,
      userImageUrl: user.imagePath,
    };
  }
  return res;
};

export const getPostByUserID = async (userId) => {
  return await Post.find({ createdBy: userId });
};

export const addPost = async (post) => {
  console.log('------------- new post: ', post);
  //add post
  const findMenu = await Menu.findById(post.menuID);
  const newPost = await Post.create(post);

  await findMenu.posts.push(newPost);
  const updateMenu = await findMenu.save();
  return newPost;
};

export const updatePost = async (post) => {
  return await Post.findByIdAndUpdate(post._id, post);
};

export const deletePost = async (id) => {
  return await Post.findOneAndRemove({ _id: id });
};
