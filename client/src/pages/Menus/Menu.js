import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
import {menusAPI} from "../../api/api";
import "../Posts/Post.scss";
import moment from "moment";
// import {Table} from "antd";
import "./Menu.scss";

export default function Menu() {
  const router = useHistory();
  const [menus, setMenus] = useState([]);
  const [deleteMenuID, setDeleteMenuID] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const getListMenu = async () => {
    const { data: res } = await menusAPI.getAll();
    setMenus(res);
  }

  useEffect(() => {
    getListMenu().then(r => {});
  },[]);

  return (
    <>
      <div className="view-post" id="customers">
        <h2>Danh sách MENU 
          <a onClick={() => router.push("/menu/new")}>Thêm mới</a> 
          
        </h2>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col">Thời gian</th>
            <th scope="col" colSpan="2">Thao tác</th>
          </tr>
          </thead>
          <tbody>
          { menus && menus.map(item  => (
            <tr>
              <td scope="row">{item._id}</td>
              <td>{item.title}</td>
              <td>{moment(item.createdAt).format("DD MMMM YYYY")}</td>
              {/*<td></td>*/}
              <td><a onClick={() => router.push("/menu/edit", {})}>Sửa</a></td>
              <td><a>Xóa</a></td>
            </tr>
            ))}

          </tbody>
        </table>
      </div>
    </>
  );
}
