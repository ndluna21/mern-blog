import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postsAPI } from "./../../api/api";
import { useLocation } from "react-router-dom";
import PostsGrid from "../../components/PostsGrid/PostsGrid";
import { Spin, Alert } from "antd";

export default function UserPosts() {
  const userState = useSelector((st) => st.user);
  const [width, setWidth] = useState(window.innerWidth);
  const [postsData, setPostsData] = useState([]);
  const location = useLocation();
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [reload, setReload] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const getPostsData = async () => {
    try {
      const { data: res } = await postsAPI.getPostByUserId(
        userID ?? userState.user.id
      );
      setPostsData(res);
      setErrorMsg(null);
    } catch (error) {
      setPostsData([]);
      setErrorMsg("Lỗi khi tải bài đăng của người dùng");
      console.log("Lỗi khi truy xuất tất cả bài đăng...", error);
    }
  };

  useEffect(() => {
    (async () => {
      if (
        location.state &&
        location.state.hasOwnProperty("userID") &&
        location.state.hasOwnProperty("userName")
      ) {
        setUserName(location.state.userName);
        setUserID(location.state.userID);
      }

      getPostsData();
    })();
  }, [location.state]);

  useEffect(() => {
    getPostsData();
  }, [reload]);

  return (
    <div className="posts-div">
      {errorMsg ? (
        <div className="loader-container">
          <Alert message={errorMsg} type="error" />
        </div>
      ) : Object.keys(postsData).length === 0 ? (
        <div className="loader-container">
          <Spin size="large" />
          <h2>Bạn hiện không có bài viết nào</h2>
        </div>
      ) : (
        <>
          <h2>{userName ? `Bài đăng của ${userName}` : "Bài đăng của bạn"}</h2>
          {Boolean(postsData) && Boolean(postsData.length) ? (
            <PostsGrid
              data={postsData}
              reloadPosts={(reloadTrigger) => setReload(reloadTrigger)}
            />
          ) : (
            <h2>Bạn không có bài đăng nào</h2>
          )}
        </>
      )}
    </div>
  );
}
