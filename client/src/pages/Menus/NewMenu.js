import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Tag, message } from "antd";
import { Form as FinalForm, Field } from "react-final-form";
// import { useSelector } from "react-redux";
import {menusAPI} from "./../../api/api";

export default function NewMenu() {
  const router = useHistory();
  const [initialValues, setInitialValues] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});
  // const userState = useSelector((st) => st.user);

  const onSubmit = async (event) => {
    console.log('--- click');
    try {
      await menusAPI.add({
        menu: { ...event },
      });
      message.success("Post created successfully");
      router.push("/menu");
    } catch (error) {
      console.log("Error creating a new post...", error.response ?? error);
      if (error.response && error.response.data) {
        setSubmissionErrors(error.response.data);
      } else setSubmissionErrors({ err: "Post error" });
    }
  };

  const checkValidation = (values) => {
    const errors = {};
    if (!values.title?.trim()) {
      errors.title = "Please enter the post's title";
    }
    return errors;
  };

  return (
    <div className="form-container">
      <h3>Create a new menu</h3>
      <FinalForm
        initialValues={initialValues}
        validate={checkValidation}
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form className="form" onSubmit={handleSubmit}>
            <Form.Item
              label="Title"
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
                Create Menu
              </Button>
              <Button htmlType="button" onClick={() => router.goBack()}>
                Back
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
