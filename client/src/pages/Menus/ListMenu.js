import React, { useEffect, useState } from "react";
import "./../Home/Home.scss";
import { Divider, Spin, Alert } from "antd";
import { useParams } from "react-router-dom";
import {menusAPI} from "../../api/api";
import PostsGrid from "../../components/PostsGrid/PostsGrid";

export default function ListMenu() {
    const [postsData, setPostsData] = useState([]);
    const [menu, setMenu] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [errorMsg, setErrorMsg] = useState(null);
    const [reload, setReload] = useState(false);

    let { id } = useParams();
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
                if (id) {
                    const menus = await menusAPI.getOne(id);
                    setPostsData(menus.data.posts);
                    setMenu(menus.data);
                    setErrorMsg(null);
                }
            } catch (error) {
                setErrorMsg("Lỗi khi truy xuất dữ liệu");
                console.log("Lỗi khi truy xuất toàn bộ dữ liệu...", error);
            }
        })();
    }, [reload, id]);

    return (
        <div className="home">
            <Divider orientation="center">{menu.title}</Divider>
            {errorMsg ? (
                <div className="loader-container">
                    <Alert message={errorMsg} type="error" />
                </div>
            ) : postsData && Boolean(postsData.length) ? (
                <PostsGrid data={postsData} reloadPosts={(param) => setReload(param)} />
            ) : (
                <div className="loader-container">
                    {/* <Spin size="large" /> */}
                    <h2>No post</h2>
                </div>
            )}
        </div>
    );
}
