import { Instance, SnapshotOut, types, applySnapshot } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const PersonDetailsModel = types
  .model("PersonDetails", {
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    gender: types.optional(types.string, ""),
    age: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    weight: types.optional(types.number, 0),
    complexion: types.optional(types.string, ""),
    bloodgroup: types.optional(types.string, ""),
    hobbies: types.optional(types.string, "-"),
    address: types.optional(types.string, "-"),
    physically: types.optional(types.string, ""),
    dob: types.optional(types.string, ""),
    profession: types.optional(types.string, ""),
    officename: types.optional(types.string, ""),
    maritalstatus: types.optional(types.string, "Single"),
    salary: types.optional(types.number, 0),
    education: types.optional(types.string, ""),
    fatherprofession: types.optional(types.string, ""),
    motherprofession: types.optional(types.string, ""),
    expectations: types.optional(types.string, ""),
    parentsmob1: types.optional(types.string, ""),
    parentsmob2: types.optional(types.string, ""),
    profilepic: types.optional(types.string, ""),
    native: types.optional(types.string, ""),
    photo: types.optional(types.string, ""),
    photo2: types.optional(types.string, ""),
    photo3: types.optional(types.string, ""),
    photo4: types.optional(types.string, ""),
    photo5: types.optional(types.string, ""),
    religion: types.optional(types.string, "")
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    updateProfile(newData) {
      const keys = Object.keys(newData)

      keys.forEach((e, i) => {
        switch (e) {
          case "age":
            self[e] = Number(newData[e]) || self[e]
            break
          case "height":
            self[e] = parseFloat(newData[e]) || self[e]
            break
          case "weight":
            self[e] = Number(newData[e]) || self[e]
            break
          case "salary":
            self[e] = Number(newData[e]) || self[e]
            break
          default:
            self[e] = newData[e] || self[e]
            break
        }
      })
    },
    reset() { applySnapshot(self, {}) }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type PersonDetailsType = Instance<typeof PersonDetailsModel>
export interface PersonDetails extends PersonDetailsType {}
type PersonDetailsSnapshotType = SnapshotOut<typeof PersonDetailsModel>
export interface PersonDetailsSnapshot extends PersonDetailsSnapshotType {}
