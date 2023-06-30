import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import {Form, Input, Button, Tag, message, Select} from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import isEmpty from "lodash.isempty";
import { useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import {menusAPI, postsAPI} from "./../../api/api";

export default function NewPost() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});
  const userState = useSelector((st) => st.user);
  const [menus, setMenus] = useState([]);
  const [menuId, setMenuId] = useState(null);

  const onSubmit = async (event) => {
    try {
      await postsAPI.add({
        post: { ...event, createdBy: userState.user.id, menuID: menuId },
      });
      message.success("Đăng bài thành công");
      router.push("/");
    } catch (error) {
      console.log("Lỗi khi tạo bài viết mới...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Lỗi đăng bài" });
    }
  };

    const getListMenu = async () => {
        const { data: res } = await menusAPI.getAll();
        let newMenu = [];
        res.map(item => {
            newMenu.push({
                value: item._id,
                label: item.title,
            })
        });

        setMenus(newMenu);
    }

  const checkValidation = (values) => {
    const errors = {};
    if (!values.title?.trim()) {
      errors.title = "Vui lòng nhập tiêu đề bài viết";
    }
    if (!values.content?.trim()) {
      errors.content = "Vui lòng nhập nội dung bài viết";
    }
    return errors;
  };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setMenuId(value);
    };
    const onSearch = (value) => {
        console.log('search:', value);
        setMenuId(value);
    };

    useEffect(() => {
        getListMenu().then(r => {});
    },[]);

  return (
    <div className="form-container">
      <h3>Tạo bài viết mới</h3>
      <FinalForm
        initialValues={initialValues}
        validate={checkValidation}
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form className="form" onSubmit={handleSubmit}>
            <Form.Item
              label="Tiêu đề"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Field name="title">
                {({ input, meta }) => (
                  <div>
                    <Input {...input} name="title" />
                    {meta.touched && meta.error && (
                      <Tag color="error">{meta.error}</Tag>
                    )}
                  </div>
                )}
              </Field>
            </Form.Item>

            <Form.Item label="Nội dung" labelCol={{ span: 24 }}>
              <Field name="content">
                {({ input, meta }) => (
                  <div>
                    <TextArea rows={4} {...input} name="content" />
                    {meta.touched && meta.error && (
                      <Tag color="error">{meta.error}</Tag>
                    )}
                  </div>
                )}
              </Field>
            </Form.Item>
              <Form.Item label="Danh mục">
                  <Select
                      showSearch
                      placeholder="Chọn danh mục"
                      optionFilterProp="children"
                      name="menu_id"
                      onChange={onChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                          (option?.title ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={menus}
                  />
              </Form.Item>
            <Form.Item label="Đường dẫn ảnh" labelCol={{ span: 24 }}>
              <Field name="imagePath">
                {({ input, meta }) => (
                  <div>
                    <Input {...input} name="imagePath" />
                    {meta.touched && meta.error && (
                      <Tag color="error">{meta.error}</Tag>
                    )}
                  </div>
                )}
              </Field>
            </Form.Item>

            {!isEmpty(submissionErrors) && (
              <div>
                {Object.entries(submissionErrors).map(([key, value]) => (
                  <Tag color="error" className="full-width" key={key}>
                    {value}
                  </Tag>
                ))}
              </div>
            )}

            <div className="buttons-wrapper-horizontal">
              <Button disabled={submitting} htmlType="submit" type="primary">
                Đăng bài viết
              </Button>
              <Button htmlType="button" onClick={() => router.goBack()}>
                Trở lại
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
