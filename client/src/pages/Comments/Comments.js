import React, { useState, useEffect } from "react";
import "./Comments.scss";
import { useSelector } from "react-redux";
import { message, Modal } from "antd";
import { commentsAPI } from "../../api/api";
import isEmpty from "lodash.isempty";
import CommentsDesktop from "./CommentsDesktop";
import CommentsMobile from "./CommentsMobile";

export default function Comments({
  data,
  setDeleteReloadingFlag,
  setEditReloadingFlag,
}) {
  const userState = useSelector((st) => st.user);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteCommentID, setDeleteSelectedCommentID] = useState(null);
  const [selectedEditCommentID, setEditSelectedCommentID] = useState(null);
  const [deleteReloading, setDeleteReloading] = useState(false);
  const [editReloading, setEditReloading] = useState(false);
  const [submissionErrors, setSubmissionErrors] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const confirmDelete = async () => {
    try {
      await commentsAPI.delete(selectedDeleteCommentID);
      setDeleteModal(false);
      message.success("Xóa bình luận thành công");
      setDeleteReloadingFlag(!deleteReloading);
      setDeleteReloading(!deleteReloading);
    } catch (error) {
      console.log("Lỗi khi xóa bình luận...", error.response ?? error);
      message.error("Lỗi khi xóa bình luận");
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else message.error("Lỗi khi xóa bình luận");
      setDeleteModal(false);
    }
  };

  const onSubmit = async (event) => {
    if (isEmpty(event) || !event.content) {
      setSubmissionErrors("Không thể gửi bình luận trống");
    } else {
      setSubmissionErrors(null);
    }

    try {
      await commentsAPI.update({
        comment: { ...event },
      });
      message.success("Cập nhật mật khẩu thành công");
      setEditReloadingFlag(!editReloading);
      setEditReloading(!editReloading);
      setEditSelectedCommentID(null);
    } catch (error) {
      console.log("Lỗi khi chỉnh sửa bình luận...", error.response ?? error);
      message.error("Lỗi khi chỉnh sửa bình luận");
    }
  };

  return (
    <div>
      {data && Boolean(data.length)
        ? data.length === 1
          ? `${data.length} Comment`
          : `${data.length} Comments`
        : null}

      {data.map((comment, index) =>
        width >= 580 ? (
          <CommentsDesktop
            comment={comment}
            index={index}
            userState={userState}
            setEditSelectedCommentID={setEditSelectedCommentID}
            selectedEditCommentID={selectedEditCommentID}
            setDeleteSelectedCommentID={setDeleteSelectedCommentID}
            selectedDeleteCommentID={selectedDeleteCommentID}
            setDeleteModal={setDeleteModal}
            onSubmit={onSubmit}
          />
        ) : (
          <CommentsMobile
            comment={comment}
            index={index}
            userState={userState}
            setEditSelectedCommentID={setEditSelectedCommentID}
            selectedEditCommentID={selectedEditCommentID}
            setDeleteSelectedCommentID={setDeleteSelectedCommentID}
            selectedDeleteCommentID={selectedDeleteCommentID}
            setDeleteModal={setDeleteModal}
            onSubmit={onSubmit}
          />
        )
      )}

      <Modal
        title="Xác nhận xóa"
        visible={deleteModal}
        onOk={() => confirmDelete()}
        onCancel={() => setDeleteModal(false)}
        centered
      >
        <p>Bạn có chắc chắn muốn xóa bình luận này?</p>
      </Modal>
    </div>
  );
}
