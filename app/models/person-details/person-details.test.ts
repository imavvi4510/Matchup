import { PersonDetailsModel, PersonDetails } from "./person-details"

test("can be created", () => {
  const instance: PersonDetails = PersonDetailsModel.create({})

  expect(instance).toBeTruthy()
})