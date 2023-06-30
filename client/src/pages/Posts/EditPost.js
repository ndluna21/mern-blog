import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Form, Input, Button, Tag, message } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import isEmpty from "lodash.isempty";
import TextArea from "antd/lib/input/TextArea";
import { postsAPI } from "./../../api/api";

export default function EditPost() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});
  const location = useLocation();
  const [postID, setPostID] = useState(null);

  useEffect(() => {
    let id = null;
    (async () => {
      if (location.state && location.state.hasOwnProperty("postID")) {
        id = location.state.postID;
        setPostID(id);
        try {
          const { data: res } = await postsAPI.getOne(id);
          console.log(res);
          setInitialValues(res);
        } catch (error) {
          console.log("Lỗi khi truy xuất bài viết...", error);
        }
      } else {
        message.error("ID bài đăng không được cung cấp");
        router.goBack();
      }
    })();
  }, [location.state]);

  const onSubmit = async (event) => {
    try {
      await postsAPI.update({
        post: event,
      });
      message.success("Chỉnh sửa bài viết thành công");
      router.goBack();
    } catch (error) {
      console.log("Lỗi khi chỉnh sửa bài viết...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Lỗi chỉnh sửa" });
    }
  };

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

  return (
    <div className="form-container">
      <h3>Chỉnh sửa bài viết</h3>
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
                Cập nhật bài viết
              </Button>
              <Button htmlType="button" onClick={() => router.goBack()}>
                Quay lại
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
