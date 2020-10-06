import { PreferenceModel, Preference } from "./preference"

test("can be created", () => {
  const instance: Preference = PreferenceModel.create({})

  expect(instance).toBeTruthy()
})

