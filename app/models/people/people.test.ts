import { PeopleModel, People } from "./people"

test("can be created", () => {
  const instance: People = PeopleModel.create({})

  expect(instance).toBeTruthy()
})