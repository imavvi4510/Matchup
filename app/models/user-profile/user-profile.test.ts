import { UserProfileModel, UserProfile } from "./user-profile"

test("can be created", () => {
  const instance: UserProfile = UserProfileModel.create({})

  expect(instance).toBeTruthy()
})

test("can up updateed", () => {
  const instance: UserProfile = UserProfileModel.create({ gender: "male" })

  instance.updateProfile({ gender: "female" })
  expect(instance.gender).toBe("female")
  expect(instance.location).toBe("Pune")
})

test("can be reset to default", () => {
  const instance: UserProfile = UserProfileModel.create({
    gender: "male",
    age: 25,
    location: "satara",
  })

  instance.reset()
  expect(instance.location).toBe("Pune")
})
