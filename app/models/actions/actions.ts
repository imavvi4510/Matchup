import { Instance, SnapshotOut, types } from "mobx-state-tree"
import omit from "ramda/src/omit"

const appActionsModal = types.model("appAction", {
  id: types.string,
  type: types.string, // one of url and screen
  value: types.string,
  params: types.maybeNull(types.string),
  templateId: types.string,
})

type AppActionsSnapshotType = SnapshotOut<typeof appActionsModal>

/**
 * Model description here for TypeScript hints.
 */
export const ActionsModel = types
  .model("Actions", {
    userActions: types.frozen<{ [id: string]: string }>(), // wil be used to store user actions across the platform
    appActions: types.optional(types.array(appActionsModal), []), // will fetch actions which app will use for ads and matches mostly a websocket connection
    showAppActions: types.optional(types.boolean, false),
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addUserActions(newActions) {
      self.userActions = {
        ...self.userActions,
        ...newActions,
      }
    },
    setUserActions(newActions) {
      self.userActions = {
        ...newActions,
      }
    },
    deleteUserAction(id) {
      self.userActions = omit([id], self.userActions)
    },
    addAppActions(newActions: AppActionsSnapshotType) {
      const isActionPresent = self.appActions.find((e) => e.id === newActions.id)
      if (!isActionPresent && typeof newActions === "object" && newActions.id) {
        self.appActions = [newActions, ...self.appActions]
        self.showAppActions = true
      }
    },
    hideAppActions() {
      self.showAppActions = false
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .postProcessSnapshot(omit(["appActions"]))

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *   */

type ActionsType = Instance<typeof ActionsModel>
export interface Actions extends ActionsType {}
type ActionsSnapshotType = SnapshotOut<typeof ActionsModel>
export interface ActionsSnapshot extends ActionsSnapshotType {}
