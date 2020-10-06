import { ActionsModel, Actions } from "./actions"
import { getSnapshot } from "mobx-state-tree"

test("can be created", () => {
  const instance: Actions = ActionsModel.create({ userActions: { 2: "like", 8: "match" } })

  expect(instance).toBeTruthy()
})

test("can set userActions", () => {
  const instance: Actions = ActionsModel.create()
  instance.setUserActions({ 2: "like", 3: "match" })

  expect(instance).toBeTruthy()
  expect(instance.userActions["2"]).toBe("like")
})

test("can delete user actions", () => {
  const instance: Actions = ActionsModel.create()
  instance.setUserActions({ 2: "like", 3: "match" })

  expect(getSnapshot(instance).userActions).toMatchObject({ 2: 'like', 3: "match" })
  instance.deleteUserAction(2)

  expect(getSnapshot(instance).userActions).toMatchObject({ 3: "match" })
})
