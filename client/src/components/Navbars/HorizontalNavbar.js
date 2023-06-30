import React, {useEffect, useState} from "react";
import {
  LoginOutlined,
  UserAddOutlined,
  SettingOutlined,
  GroupOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Input, Row, Col, Button } from "antd";
import blogLogo from "./../../assets/images/logo512.png";
import { useSelector, useDispatch } from "react-redux";
import { userAuthActions } from "./../../redux/actions/actionCreator";
import {menusAPI} from "../../api/api";
import {useHistory} from "react-router-dom";
import axios from "axios";
const { SubMenu } = Menu;

const {Search} = Input;

export default function HorizontalNavbar() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const router = useHistory();
  const userState = useSelector((st) => st.user);
  const dispatch = useDispatch();

  const [menus, setMenus] = useState([]);

  const getListMenu = async () => {
    const { data: res } = await menusAPI.getAll();
    setMenus(res);
  }


  useEffect(() => {
    getListMenu().then(r => {});
  },[]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/post/search?keyword=${keyword}`);
      setResults(response.data);
    } catch (error) {
      console.log('Lỗi tìm kiếm:', error);
    }
  }

  return (
    <div>
      <Menu selectedKeys={"logo"} mode="horizontal" theme="light">
        <Menu.Item className="unhoverable-menu-item">
          <a href="/">
            <Avatar src={blogLogo} shape="square" /> &nbsp; Blog App
          </a>
        </Menu.Item>

        {userState.isLoggedIn ? (
          <>
            <SubMenu
              key="SubMenu"
              icon={<Avatar src={userState.user.imagePath} shape="circle" />}
              title={" " + userState.user.userName}
              className="float-right "
            >
              <Menu.Item key="userProfile" icon={<SettingOutlined />}>
                <a href="/user/profile">Thông tin người dùng</a>
              </Menu.Item>
              <Menu.Item key="userPosts" icon={<GroupOutlined />}>
                <a href="/user/posts">Bài viết đã đăng</a>
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LoginOutlined />}
                onClick={() => dispatch(userAuthActions.logout())}
              >
                Đăng xuất
              </Menu.Item>
            </SubMenu>
                <Menu.Item
                  key="newPost"
                  icon={<FormOutlined />}
                  className="float-right"
                >
                  <a href="/posts/new">Bài viết mới</a>
                </Menu.Item>
            {userState.user.userType === 'admin' && (
              <>
                <Menu.Item
                    key="newMenu"
                    icon={<FormOutlined />}
                    className="float-right"
                >
                  <a href="/menu">QL Chuyên mục</a>
                </Menu.Item>
                <Menu.Item
                    key="kiemDuyet"
                    icon={<FormOutlined />}
                    className="float-right"
                >
                  <a href="/check">Kiểm duyệt bài viết</a>
                </Menu.Item>
              </>
            )}
            <Row justify="end" gutter={16} className="float-right">
              <Col>
                 <Input placeholder="Nhập từ khóa" 
                   value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                 />
               </Col>
               <Col>
                 <Button type="primary" onClick={handleSearch}>
                   Tìm kiếm
                 </Button>
               </Col>
               {results.map((post) => (
                 <li key={post._id}>
                   <h3>{post.title}</h3>
                   <p>{post.author}</p>
                 </li>
               ))}
            </Row> 
          </>
        ) : (
          <>
            <Menu.Item
              key="login"
              icon={<LoginOutlined />}
              className="float-right"
            >
              <a href="/login">Đăng nhập</a>
            </Menu.Item>
            <Menu.Item
              key="logout"
              icon={<UserAddOutlined />}
              className="float-right"
            >
              <a href="/signup">Đăng kí</a>
            </Menu.Item>
          </>
        )}
        
        {menus && menus.map((item, index) => (
            <Menu.Item
                key={index}
                className="float-right"
            >
              <a onClick={() => router.push(`/menu/list/${item._id}`)}>{item.title}</a>
            </Menu.Item>
        ))}
      </Menu>
    </div>
  );
}
