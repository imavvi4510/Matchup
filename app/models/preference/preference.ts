import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */

export const PreferenceModel = types
  .model("Preference", {
    maritalStatus: types.maybe(types.string),
    city: types.maybe(types.string),
    state: types.maybe(types.string),
    religion: types.maybe(types.string),
    ageFrom: types.maybe(types.number),
    ageTo: types.maybe(types.number),
    minHeight: types.maybe(types.number),
    maxHeight: types.maybe(types.number),
    actionComplete: types.optional(types.boolean, false),
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    set(key, value) {
      self[key] = value
    },
    init(preferences) {
      const { maritalStatus, city, ageFrom, ageTo, minHeight, maxHeight, complexion } = preferences
      self.maritalStatus = maritalStatus || undefined
      self.maxHeight = Number(maxHeight) || undefined
      self.minHeight = Number(minHeight) || undefined
      self.ageFrom = Number(ageFrom) || undefined
      self.ageTo = Number(ageTo) || undefined
      self.city = city || undefined
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type PreferenceType = Instance<typeof PreferenceModel>
export interface Preference extends PreferenceType {}
type PreferenceSnapshotType = SnapshotOut<typeof PreferenceModel>
export interface PreferenceSnapshot extends PreferenceSnapshotType {}
