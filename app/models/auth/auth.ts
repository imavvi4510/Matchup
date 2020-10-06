import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const AuthModel = types
  .model("Auth", {
    token: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    firstName: types.optional(types.string, ""),
    isProfileComplete: types.optional(types.boolean, false),
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setUser(newUser) {
      self.email = newUser.email
      self.token = newUser.token
      self.firstName = (newUser.firstName ?? "").split(" ")[0]
      self.isProfileComplete = newUser.isProfileComplete || false
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type AuthType = Instance<typeof AuthModel>
export interface Auth extends AuthType {}
type AuthSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthSnapshot extends AuthSnapshotType {}
