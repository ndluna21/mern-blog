import React, { useEffect, useState } from "react";
import Jumbotron from "../../components/Jumbotron/Jumbotron";
import "./Home.scss";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Divider, Spin, Alert } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { postsAPI } from "../../api/api";
import { useSelector } from "react-redux";
import PostsGrid from "../../components/PostsGrid/PostsGrid";
import Post from "../Posts/Post";

export default function Home() {
  const router = useHistory();
  const userState = useSelector((st) => st.user);
  const [postsData, setPostsData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await postsAPI.getAll();
        setPostsData(res);
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg("Lỗi truy xuất dữ liệu");
        console.log("Lỗi khi truy xuất toàn bộ dữ liệu...", error);
      }
    })();
  }, [reload]);

  return (
    <div className="home">
      {userState.isLoggedIn ? (
        <>
          <Jumbotron>
            <div className="home-jumbotron">
              {width <= 650 ? (
                <div className="centered-section">
                  <h3>Một trang blog dành cho </h3>
                  <h2>MỌI NGƯỜI</h2>
                  <Button
                    type="primary"
                    shape="round"
                    icon={<RightCircleOutlined />}
                    size="large"
                    onClick={() => router.push("/posts/new")}
                  >
                    Viết bài ngay!
                  </Button>
                </div>
              ) : (
                <>
                  <div className="left-section">
                    <h3>Một trang blog dành cho </h3>
                    <h2>MỌI NGƯỜI</h2>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<RightCircleOutlined />}
                      size="large"
                      onClick={() => router.push("/posts/new")}
                    >
                      Bắt đầu sử dụng
                    </Button>
                  </div>
                  <div className="right-section">
                    <Player
                      autoplay
                      loop
                      src="https://assets10.lottiefiles.com/packages/lf20_GtqlRg.json"
                    />
                  </div>
                </>
              )}
            </div>
          </Jumbotron>
        </>
      ) : (
        <>
          <Jumbotron>
            <div className="home-jumbotron">
              {width <= 650 ? (
                <div className="centered-section">
                  <h3>Một trang blog dành cho</h3>
                  <h2>MỌI NGƯỜI</h2>
                  <Button
                    type="primary"
                    shape="round"
                    icon={<RightCircleOutlined />}
                    size="large"
                    onClick={() => router.push("/login")}
                  >
                    Bắt đầu sử dụng
                  </Button>
                  <img src="https://nguoikesu.com/images/timeline-bg.jpg#joomlaImage://local-images/timeline-bg.jpg?width=1100&height=360" alt=""/>
                </div>
              ) : (
                <>
                  <div className="left-section">
                    <h3>Một trang blog dành cho</h3>
                    <h2>MỌI NGƯỜI</h2>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<RightCircleOutlined />}
                      size="large"
                      onClick={() => router.push("/login")}
                    >
                      Bắt đầu sử dụng
                    </Button>
                  </div>
                  <div className="right-section">
                    <Player
                      autoplay
                      loop
                      src="https://assets10.lottiefiles.com/packages/lf20_GtqlRg.json"
                    />
                  </div>
                </>
              )}
            </div>
          </Jumbotron>
        </>
      )}
      <Divider orientation="center">Bài viết được xem nhiều nhất</Divider>
      {errorMsg ? (
        <div className="loader-container">
          <Alert message={errorMsg} type="error" />
        </div>
      ) : postsData && Boolean(postsData.length) && Boolean(Post.isActive) ? (
        <PostsGrid data={postsData} reloadPosts={(param) => setReload(param)} />
      ) : (
        <div className="loader-container">
          <Spin size="large" />
          {/* <h2>No post</h2> */}
        </div>
      )}
    </div>
  );
}
