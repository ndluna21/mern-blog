import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Tag, message } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
import {menusAPI} from "./../../api/api";

export default function NewMenu() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});

  const onSubmit = async (event) => {
    console.log('--- click');
    try {
      await menusAPI.add({
        menu: { ...event },
      });
      message.success("Tạo danh mục thành công");
      router.push("/menu");
    } catch (error) {
      console.log("Lỗi khi tạo danh mục mới...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Tạo lỗi" });
    }
  };

  const checkValidation = (values) => {
    const errors = {};
    if (!values.title?.trim()) {
      errors.title = "Vui lòng nhập tên danh mục";
    }
    return errors;
  };

  return (
    <div className="form-container">
      <h3>Tạo danh mục mới</h3>
      <FinalForm
        initialValues={initialValues}
        validate={checkValidation}
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form className="form" onSubmit={handleSubmit}>
            <Form.Item
              label="Tên danh mục"
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
            <div className="buttons-wrapper-horizontal">
              <Button htmlType="submit" type="primary">
                Tạo danh mục
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
