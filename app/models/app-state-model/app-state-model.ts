import { Instance, SnapshotOut, types } from "mobx-state-tree"
import omit from "ramda/src/omit"

/**
 * this model contains possible state
 * the app can be in
 * eg: toast, network error
 */

export const DEFAULT_APPSTATE = {
  toast: {
    text: "",
    styles: "",
  },
}

const toastModal = types
  .model("toastModal", {
    text: types.optional(types.string, ""),
    styles: types.optional(types.string, ""),
  })
  .actions((self) => ({
    setToast(newToast) {
      self.text = newToast.text
      self.styles = newToast.styles
    },
  }))

export const AppStateModel = types
  .model("AppStateModel", {
    toast: types.optional(toastModal,DEFAULT_APPSTATE.toast)
  })
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({}))
  .postProcessSnapshot(omit(["toast"]))

type AppStateType = Instance<typeof AppStateModel>
export interface AppState extends AppStateType {}
type AppStateSnapshotType = SnapshotOut<typeof AppStateModel>
export interface AppStateSnapshot extends AppStateSnapshotType {}
