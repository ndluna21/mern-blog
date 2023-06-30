import { useEffect, useState } from "react"
import { postsAPI } from "../../api/api"
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function Check(){

    const [posts, setPosts] = useState([])
    const getListCheck = async () => {
        const {data: res} = await postsAPI.getAll();
        setPosts(res);
    }

    useEffect(() => {
        getListCheck().then(r => {});
      },[]);

    return (
        <>
      <div className="view-post" id="customers">
        <h2>Danh sách Bài viết cần phê duyệt</h2>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">Người đăng</th>
            <th scope="col">Tên</th>
            <th scope="col">Nội dung</th>
            <th scope="col" colSpan="2">Thao tác</th>
          </tr>
          </thead>
          <tbody>
          { posts && posts.map(item  => (
            <tr>
                <td>{item.createBy}</td>
              <td>{item.title}</td>
              <td>{item.content}</td>
              {/*<td></td>*/}
              <td><a><CheckCircleOutlined /></a></td>
              <td><a><CloseCircleOutlined /></a></td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
    )
}