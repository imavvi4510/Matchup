import { ImageProps } from "react-native"
import { COMPLEXION, BLOODGROUP } from "../constants"
import { number } from "mobx-state-tree/dist/internal"

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never

export type IBasicUserInfo = {
  name: string
  height: {
    foot: number
    inch: number
  }
  age: number
  weight: number
  profession: string
}

export type IUserStory = {
  id: string
  profilepic: string
  name: string
  age: number
  height: number
  weight: number
  profession: string
  native: string
  expectations: string
}

// forms types

export interface IAddPersonalDetailShape {
  gender: "male" | "female"
  dob: string
  age: number
  height: number
  weight: number
  complexion: ElementType<typeof COMPLEXION>
  bloodgroup: ElementType<typeof BLOODGROUP>
  physically: "Yes" | "No"
  hobbies: string
  address: string
  maritalstatus: string
}

export interface IAddProfessinolDetailShape {
  profession: string
  officename: string
  salary: number
  education: string
}

export interface IFamilyDetailsShape {
  fatherprofession: string
  motherprofession: string
  expectations: string
  parentsmob1: string
  parentsmob2: string
}
