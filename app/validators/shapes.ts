import * as yup from "yup"
import * as fields from "./fields"
import { SignFormShape } from "../screens"
import { IAddPersonalDetailShape, IFamilyDetailsShape } from "../screens/types"
import { BLOODGROUP, COMPLEXION } from "../constants"

export const registerForm: yup.ObjectSchema<SignFormShape> = yup.object().shape({
  email: fields.emailValidator,
  name: fields.nameValidator,
  password: fields.passwordValidator,
})

export const addPersonalDetailsForm: yup.ObjectSchema<IAddPersonalDetailShape> = yup
  .object()
  .shape({
    gender: yup.mixed().oneOf(["male", "female"], fields.SELECT_DROPDOWN),
    dob: yup.string().required(fields.REQUIRED_FEILD),
    age: yup.string().required(fields.REQUIRED_FEILD),
    height: yup.string().required(fields.REQUIRED_FEILD),
    weight: yup.string().required(fields.REQUIRED_FEILD),
    address: fields.longTextValidator,
    hobbies: yup
      .string()
      .required(fields.REQUIRED_FEILD)
      .max(50, "Must be less than 50 characters")
      .matches(/^[a-zA-Z ,]*$/, fields.INVALID_FEILD),
    bloodgroup: yup.mixed().oneOf(BLOODGROUP, fields.SELECT_DROPDOWN),
    complexion: yup.mixed().oneOf(COMPLEXION, fields.SELECT_DROPDOWN),
    physically: yup.mixed().oneOf(["Yes", "No"], fields.SELECT_DROPDOWN),
    state: yup
      .object()
      .shape({
        id: yup.string().notRequired(),
        value: yup.string().required(fields.REQUIRED_FEILD),
      })
      .required(fields.REQUIRED_FEILD),
    city: yup
      .object()
      .shape({ value: yup.string().required(fields.REQUIRED_FEILD) })
      .required(fields.REQUIRED_FEILD),
    religion: yup.string().required(fields.REQUIRED_FEILD),
  })

export const addProfessinolDetails = yup.object().shape({
  profession: fields.nameValidator,
  officename: fields.nameValidator,
  salary: yup.string().required(fields.SELECT_DROPDOWN),
  education: fields.nameValidator,
})

export const familyDetailShape: yup.ObjectSchema<IFamilyDetailsShape> = yup.object().shape({
  fatherprofession: fields.nameValidator,
  motherprofession: fields.nameValidator,
  expectations: fields.longTextValidator,
  parentsmob1: fields.mobileValidator,
  parentsmob2: fields.mobileValidator,
})
