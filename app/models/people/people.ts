import { Instance, SnapshotOut, types } from "mobx-state-tree"
import omit from "ramda/es/omit"

/**
 * Model description here for TypeScript hints.
 */

const personModal = types.model("person", {
  id: types.optional(types.string, ""),
  profilepic: types.optional(types.string, "profile.png"),
  name: types.optional(types.string, ""),
  age: types.optional(types.string, "0"),
  height: types.optional(types.string, "0"),
  weight: types.optional(types.string, "0"),
  profession: types.optional(types.string, ""),
  native: types.optional(types.string, ""),
  expectations: types.optional(types.string, ""),
  isLiked: types.optional(types.boolean, false),
})

export const PeopleModel = types
  .model("People", {
    peoplelist: types.optional(types.array(personModal), []),
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setPeoples(newList: SnapshotOut<typeof PeopleModel>) {
      self.peoplelist = newList
    },
    setPerson(index: number, newPerson: SnapshotOut<typeof personModal>) {
      self.peoplelist[index] = newPerson
    },
    deletePerson(id: number) {
      self.peoplelist = self.peoplelist.filter((e) => e.id !== id)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  */
  .postProcessSnapshot(omit(["peoplelist"]))

type PeopleType = Instance<typeof PeopleModel>
export interface People extends PeopleType {}
type PeopleSnapshotType = SnapshotOut<typeof PeopleModel>
export interface PeopleSnapshot extends PeopleSnapshotType {}
