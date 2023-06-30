import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Tag, message } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import isEmpty from "lodash.isempty";
import { useDispatch, useSelector } from "react-redux";
import { userAuthActions } from "./../../redux/actions/actionCreator";

export default function LoginForm() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});
  const dispatch = useDispatch();
  const userState = useSelector((st) => st.user);

  const onSubmit = async (event) => {
    try {
      dispatch(userAuthActions.login({ user: event }));
    } catch (error) {
      console.log("Lỗi khi đăng nhập...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Lỗi đăng nhập" });
    }
  };

  const checkValidation = (values) => {
    const errors = {};
    if (!values.email?.trim()) {
      errors.email = "Vui lòng nhập Email";
    }
    if (!values.password?.trim()) {
      errors.password = "Vui lòng nhập mật khẩu";
    }
    return errors;
  };

  useEffect(() => {
    if (userState.error) {
      setSubmissionErrors([userState.error]);
    }
    if (userState.isLoggedIn) {
      message.success("Đăng nhập thành công");
      router.push("/");
    }
  }, [userState]);

  return (
    <FinalForm
      initialValues={initialValues}
      validate={checkValidation}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form className="form" onSubmit={handleSubmit}>
          <Form.Item
            label="Email"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
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

          {!isEmpty(submissionErrors) && (
            <div>
              {typeof submissionErrors === "object" ? (
                Object.entries(submissionErrors).map(([key, value]) => (
                  <Tag color="error" className="full-width" key={key}>
                    {value}
                  </Tag>
                ))
              ) : (
                <Tag color="error" className="full-width">
                  {submissionErrors}
                </Tag>
              )}
            </div>
          )}

          <div className="buttons-wrapper-vertical">
            <Button disabled={submitting} htmlType="submit" type="primary">
              Đăng nhập
            </Button>
            <Button
              htmlType="button"
              type="link"
              onClick={() => router.push("signup")}
            >
              Không có tài khoản? Đăng kí ngay!
            </Button>
          </div>
        </form>
      )}
    />
  );
}
