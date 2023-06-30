import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Tag, message, Image, Spin, Alert } from "antd";
import {
  EditFilled,
  LockFilled,
  SaveFilled,
  CaretLeftOutlined,
} from "@ant-design/icons";
import { Form as FinalForm, Field } from "react-final-form";
import isEmpty from "lodash.isempty";
import { useDispatch, useSelector } from "react-redux";
import { usersAPI } from "./../../api/api";
import defaultUser from "./../../assets/images/default-user.png";
import "./UserProfile.scss";
import { userAuthActions } from "./../../redux/actions/actionCreator";

export default function UserProfile() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});
  const userState = useSelector((st) => st.user);
  const [editing, setEditing] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (userState && userState.user && userState.user.id) {
        try {
          const { data: res } = await usersAPI.getOne(userState.user.id);
          setInitialValues(res);
          setErrorMsg(null);
        } catch (error) {
          setInitialValues({});
          setErrorMsg("Lỗi khi tải thông tin người dùng");
          console.log("Lỗi khi truy xuất dữ liệu người dùng...", error);
        }
      } else {
        message.error("Đã xảy ra lỗi khi truy xuất ID người dùng");
        router.push("/");
      }
    })();
  }, []);

  const checkValidation = (values) => {
    const errors = {};
    if (editing && !values.userName?.trim()) {
      errors.userName = "Vui lòng nhập tên người dùng";
    }
    if (editingPassword && !values.oldPassword?.trim()) {
      errors.password = "Vui lòng nhập mật khẩu cũ";
    }
    if (editingPassword && !values.password?.trim()) {
      errors.password = "Vui lòng nhập mật khẩu";
    }
    if (editingPassword && !values.confirmPassword?.trim()) {
      errors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu";
    } else if (editingPassword && values.confirmPassword !== values.password) {
      errors.confirmPassword = "Mật khẩu không trùng hợp";
    }
    if (editing && !values.email?.trim()) {
      errors.email = "Vui lòng nhập Email";
    }
    return errors;
  };

  const onSubmit = async (event) => {
    setSubmissionErrors([]);
    try {
      await usersAPI.update({ user: event });
      dispatch(userAuthActions.updateUser(event));
      message.success("Hồ sơ người dùng đã được cập nhật thành công");
      setEditing(false);
      setEditingPassword(false);
      setInitialValues(event);
    } catch (error) {
      console.log("Lỗi khi cập nhật hồ sơ người dùng..", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Lỗi cập nhật hồ sơ người dùng" });
    }
  };

  return (
    <div>
      <div className="user-profile">
        {errorMsg ? (
          <div className="loader-container">
            <Alert message={errorMsg} type="error" />
          </div>
        ) : Object.keys(initialValues).length === 0 ? (
          <div className="loader-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <h2 className="centered-text ">
              Hồ sơ của {initialValues.userName}
            </h2>
            <div className="user-image centered-text ">
              <Image
                className="image"
                src={initialValues.imagePath ?? defaultUser}
              />
            </div>
            <div className="user-info">
              <FinalForm
                initialValues={initialValues}
                validate={checkValidation}
                onSubmit={onSubmit}
                render={({ handleSubmit, submitting, form }) => (
                  <form className="form" onSubmit={handleSubmit}>
                    <Form.Item
                      label="Tên người dùng"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Field name="userName">
                        {({ input, meta }) => (
                          <div>
                            <Input
                              {...input}
                              name="userName"
                              readOnly={!editing}
                              className={!editing && "disabled"}
                            />
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
                            <Input
                              {...input}
                              name="email"
                              readOnly={!editing}
                              className={!editing && "disabled"}
                            />
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
                            <Input
                              {...input}
                              value={
                                !initialValues.summary && !editing
                                  ? "No content"
                                  : initialValues.summary
                              }
                              name="summary"
                              readOnly={!editing}
                              className={!editing && "disabled"}
                            />
                            {meta.touched && meta.error && (
                              <Tag color="error">{meta.error}</Tag>
                            )}
                          </div>
                        )}
                      </Field>
                    </Form.Item>
                    {editing && (
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
                    )}

                    {editingPassword && (
                      <>
                        <Form.Item label="Mật khẩu cũ" labelCol={{ span: 24 }}>
                          <Field name="oldPassword">
                            {({ input, meta }) => (
                              <div>
                                <Input.Password
                                  {...input}
                                  name="oldPassword"
                                  className="no-radius"
                                />
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
                        <Form.Item
                          label="Nhập lại mật khẩu"
                          labelCol={{ span: 24 }}
                        >
                          <Field name="confirmPassword">
                            {({ input, meta }) => (
                              <div>
                                <Input.Password
                                  {...input}
                                  name="confirmPassword"
                                />
                                {meta.touched && meta.error && (
                                  <Tag color="error">{meta.error}</Tag>
                                )}
                              </div>
                            )}
                          </Field>
                        </Form.Item>
                      </>
                    )}

                    {!isEmpty(submissionErrors) && (
                      <div>
                        {Object.entries(submissionErrors).map(
                          ([key, value]) => (
                            <Tag color="error" className="full-width" key={key}>
                              {value}
                            </Tag>
                          )
                        )}
                      </div>
                    )}

                    <div className="buttons-wrapper-horizontal m-auto">
                      {!(editing || editingPassword) && (
                        <>
                          <Button
                            htmlType="button"
                            type="primary"
                            icon={<EditFilled />}
                            onClick={() => {
                              setEditing(true);
                              setEditingPassword(false);
                            }}
                          >
                            Chỉnh sửa hồ sơ
                          </Button>
                          <Button
                            htmlType="button"
                            type="primary"
                            icon={<LockFilled />}
                            onClick={() => {
                              setEditing(false);
                              setEditingPassword(true);
                            }}
                          >
                            Đổi mật khẩu
                          </Button>
                        </>
                      )}

                      {(editing || editingPassword) && (
                        <>
                          <Button
                            disabled={submitting}
                            htmlType="submit"
                            type="primary"
                            icon={<SaveFilled />}
                          >
                            Xác nhận
                          </Button>
                          <Button
                            htmlType="button"
                            type="primary"
                            icon={<CaretLeftOutlined />}
                            onClick={() => {
                              setEditing(false);
                              setEditingPassword(false);
                              form.reset();
                            }}
                          >
                            Đóng
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
