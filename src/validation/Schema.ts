import * as yup from "yup";

export const schemaRegister = yup.object({
  fullName: yup
    .string()
    .required("Full Name is Required")
    .min(3, "Full Name should be at least 3 Character"),
  email: yup
    .string()
    .required("Email is Required")
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Enter Vaild Mail extext@test.com"
    ),
  password: yup
    .string()
    .required("Password is Required")
    .min(5, "Password should be at least 5 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
  role: yup.string().required("Role is Required"),
});

export const schemaLogin = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is Required")
    .min(5, "Password should be at least 5 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
});
