import Axios from "axios";
const axiosConfig = {
  baseURL: `http://${window.location.hostname}:5005/api`,
};

const axios = Axios.create(axiosConfig);
console.log(window.location.hostname)

// AUTH
export const authAPI = {
  login: (data) => axios.post(`/auth/login`, data),
  signup: (data) => axios.post(`/auth/signup`, data),
};

// USERS
export const usersAPI = {
  getAll: () => axios.get(`/users`),
  getOne: (id) => axios.get(`/users/${id}`),
  add: (data) => axios.post(`/users`, data),
  update: (data) => axios.put(`/users`, data),
  delete: (id) => axios.delete(`/users/${id}`),
};

// POSTS
export const postsAPI = {
  getAll: () => axios.get(`/posts`),
  getPostsByMenu: (id = null) => axios.get(`/posts?menu_id=${id}`),
  getPostByUserId: (id) => axios.get(`/posts/user/${id}`),
  getOne: (id) => axios.get(`/posts/${id}`),
  add: (data) => axios.post(`/posts`, data),
  update: (data) => axios.put(`/posts`, data),
  delete: (id) => axios.delete(`/posts/${id}`),
};

export const menusAPI = {
  getAll: () => axios.get(`/menus`),
  getPostByUserId: (id) => axios.get(`/posts/user/${id}`),
  getOne: (id) => axios.get(`/menus/${id}`),
  add: (data) => axios.post(`/menus/create`, data),
  update: (data) => axios.put(`/menus`, data),
  delete: (id) => axios.delete(`/menus/${id}`),
};

// COMMENTS
export const commentsAPI = {
  add: (data) => axios.post(`/comments`, data),
  update: (data) => axios.put(`/comments`, data),
  delete: (id) => axios.delete(`/comments/${id}`),
};
