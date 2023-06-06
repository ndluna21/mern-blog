import Menu from "./../models/menu";

export const getAllMenu = async () => {
  return await Menu.find({});
};

export const addMenu = async (menu) => {
  //add post
  return await Menu.create(menu);
};

export const updateMenu = async (menu) => {
  return await Menu.findByIdAndUpdate(menu._id, menu);
};

export const deleteMenu = async (id) => {
  return await Menu.findOneAndRemove({ _id: id });
};

export const getOneMenu = async (id) => {
  //find post
  const menu = await Menu.findById(id).populate({
    path: "posts",
    populate: {
      path: "createdBy",
    },
  });
  return menu;
};
