import { AuthModel, Auth } from "./auth"

test("can be created", () => {
  const instance: Auth = AuthModel.create({})

  expect(instance).toBeTruthy()
})
