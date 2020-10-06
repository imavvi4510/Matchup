import * as yup from "yup"

//messages
export const REQUIRED_FEILD = "This field is required"
export const INVALID_FEILD = "This field is invalid"
export const INVALID_NUMBER = "Must be greater than zero"
export const SELECT_DROPDOWN = "Please select from dropdown"
//fields validators
export const nameValidator = yup
  .string()
  .required(REQUIRED_FEILD)
  .max(50, "Must be less than 50 characters")
  .matches(/^[a-zA-Z ]*$/, INVALID_FEILD)

export const passwordValidator = yup.string().required(REQUIRED_FEILD)

export const emailValidator = yup.string().required(REQUIRED_FEILD).email(INVALID_FEILD)

export const longTextValidator = yup
  .string()
  .required(REQUIRED_FEILD)
  .max(500, "Must be less than 500 characters")

export const mobileValidator = yup.string().required().min(10, INVALID_FEILD)
