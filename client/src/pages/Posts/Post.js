import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Image, Spin, Alert, Modal, Divider } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { postsAPI } from "./../../api/api";
import "./Post.scss";
import defaultPostImage from "./../../assets/images/default-post-image.jpg";
import defaultUser from "./../../assets/images/default-user.png";
import moment from "moment";
import Avatar from "antd/lib/avatar/avatar";
import CommentForm from "../Comments/CommentForm";
import Comments from "../Comments/Comments";

export default function Post() {
  const [postData, setPostData] = useState({});
  const router = useHistory();
  const userState = useSelector((st) => st.user);
  const location = useLocation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePostID, setDeletePostID] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reloadDelete, setReloadDelete] = useState(null);
  const [reloadEdit, setReloadEdit] = useState(null);
  const [reloadPost, setReloadPost] = useState(null);

  useEffect(() => {
    let id = null;
    (async () => {
      if (location.state && location.state.hasOwnProperty("postID")) {
        id = location.state.postID;
        try {
          const { data: res } = await postsAPI.getOne(id);
          setPostData(res);
          setErrorMsg(null);
        } catch (error) {
          setPostData({});
          setErrorMsg("Lỗi khi tải dữ liệu bài viết");
          console.log("Lỗi khi truy xuất một bài đăng...", error);
        }
      } else {
        message.error("Đã xảy ra lỗi khi truy xuất ID bài đăng");
        router.push("/");
      }
    })();
  }, [location.state, reloadDelete, reloadPost, reloadEdit]);

  const confirmDelete = async () => {
    try {
      await postsAPI.delete(deletePostID);
      setDeleteModal(false);
      message.success("Xóa bài viết thành công");
      router.goBack();
    } catch (error) {
      console.log("Lỗi khi xóa bài viết...", error.response ?? error);
      message.error("Lỗi xóa bài đăng");
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else message.error("Lỗi xóa bài đăng");
      setDeleteModal(false);
    }
  };

  return (
    <div className="view-post">
      {errorMsg ? (
        <div className="loader-container">
          <Alert message={errorMsg} type="error" />
        </div>
      ) : Object.keys(postData).length === 0 ? (
        <div className="loader-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="post-header">
            <h1>{postData.title}</h1>
            <div className="two-cols">
              <div>
                <Avatar
                  size="large"
                  src={postData.userImageUrl ?? defaultUser}
                />
                &nbsp;
                {postData.createdByName}
              </div>
              <p>{moment(postData.createdAt).format("DD MMMM YYYY")}</p>
            </div>
          </div>
          <div className="centered-text">
            <Image
              src={postData.imagePath ? postData.imagePath : defaultPostImage}
            />
          </div>
          <div className="post-content">{postData.content}</div>
          {postData.createdBy === userState.user.id && (
            <div className="buttons-wrapper-horizontal">
              <Button
                htmlType="button"
                type="primary"
                icon={<EditFilled />}
                onClick={() =>
                  router.push("/posts/edit", { postID: postData._id })
                }
              >
                Sửa
              </Button>

              <Button
                htmlType="button"
                type="primary"
                icon={<DeleteFilled />}
                danger
                onClick={() => {
                  setDeletePostID(postData._id);
                  setDeleteModal(true);
                }}
              >
                Xóa
              </Button>
            </div>
          )}
          {Boolean(userState.user.id) && (
            <>
              <Divider />
              <CommentForm
                createdBy={userState.user.id}
                postId={postData._id}
                setReloadingFlag={(value) => setReloadPost(value)}
              />
            </>
          )}
          <Comments
            data={postData.comments}
            setDeleteReloadingFlag={(value) => setReloadDelete(value)}
            setEditReloadingFlag={(value) => setReloadEdit(value)}
          />

          <Modal
            title="Xác nhận xóa bài"
            visible={deleteModal}
            onOk={() => confirmDelete()}
            onCancel={() => setDeleteModal(false)}
            centered
          >
            <p>Bạn có chắc muốn xóa bài viết?</p>
          </Modal>
        </>
      )}
    </div>
  );
}
