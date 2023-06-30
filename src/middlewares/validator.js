import Validator from "validator";
import isEmpty from "lodash.isempty";

export const validateSignup = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = data.userName ? data.userName : "";
  data.email = data.email ? data.email : "";
  data.password = data.password ? data.password : "";
  data.password2 = data.confirmPassword ? data.confirmPassword : "";

  if (Validator.isEmpty(data.userName)) {
    errors.userName = "Tên người dùng không được để trống";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email không được để trống";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Mật khẩu không dược để trống";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Xác nhận mật khẩu không được để trống";
  }
  if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.password = "Mật khẩu phải có ít nhất 5 kí tự";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Mật khẩu phải trùng khớp";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validateSignin = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = data.email ? data.email : "";
  data.password = data.password ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email không được để trống";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Mật khẩu không được để trống";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
