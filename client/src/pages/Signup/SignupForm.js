import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Tag, message } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import { authAPI } from "./../../api/api";
import isEmpty from "lodash.isempty";

export default function SignupForm() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});

  const onSubmit = async (event) => {
    try {
      event.user_type = 'admin';
      console.log('---------- event: ', event);
      await authAPI.signup({ user: event });
      message.success("Tạo tài khoản thành công");
      router.push("/login");
    } catch (error) {
      console.log("Lỗi khi tạo người dùng mới...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Đăng ký lỗi" });
    }
  };

  const checkValidation = (values) => {
    const errors = {};
    if (!values.userName?.trim()) {
      errors.userName = "Vui lòng nhập tên người dùng";
    }
    if (!values.password?.trim()) {
      errors.password = "Vui lòng nhập mật khẩu";
    }
    if (!values.confirmPassword?.trim()) {
      errors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Mật khẩu không trùng hợp";
    }
    if (!values.email?.trim()) {
      errors.email = "Vui lòng nhập email";
    }
    return errors;
  };

  return (
    <FinalForm
      initialValues={initialValues}
      validate={checkValidation}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form className="form" onSubmit={handleSubmit}>
          <Form.Item
            label="Tên người dùng"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Field name="userName">
              {({ input, meta }) => (
                <div>
                  <Input {...input} name="userName" />
                  {meta.touched && meta.error && (
                    <Tag color="error">{meta.error}</Tag>
                  )}
                </div>
              )}
            </Field>
          </Form.Item>
          <Form.Item label="Mật khẩu" labelCol={{ span: 24 }}>
            <Field name="password">
              {({ input, meta }) => (
                <div>
                  <Input.Password {...input} name="password" />
                  {meta.touched && meta.error && (
                    <Tag color="error">{meta.error}</Tag>
                  )}
                </div>
              )}
            </Field>
          </Form.Item>
          <Form.Item label="Nhập lại mật khẩu" labelCol={{ span: 24 }}>
            <Field name="confirmPassword">
              {({ input, meta }) => (
                <div>
                  <Input.Password {...input} name="confirmPassword" />
                  {meta.touched && meta.error && (
                    <Tag color="error">{meta.error}</Tag>
                  )}
                </div>
              )}
            </Field>
          </Form.Item>
          <Form.Item label="Email" labelCol={{ span: 24 }}>
            <Field name="email">
              {({ input, meta }) => (
                <div>
                  <Input {...input} name="email" />
                  {meta.touched && meta.error && (
                    <Tag color="error">{meta.error}</Tag>
                  )}
                </div>
              )}
            </Field>
          </Form.Item>
          <Form.Item label="Tóm tắt" labelCol={{ span: 24 }}>
            <Field name="summary">
              {({ input, meta }) => (
                <div>
                  <Input {...input} name="summary" />
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

          <div className="buttons-wrapper-vertical">
            <Button disabled={submitting} htmlType="submit" type="primary">
              Đăng kí
            </Button>
            <Button
              htmlType="button"
              type="link"
              onClick={() => router.push("login")}
            >
              Đã có tài khoản? Đăng nhập!
            </Button>
          </div>
        </form>
      )}
    />
  );
}
