import { AppStateModel, AppState, DEFAULT_APPSTATE } from "./app-state-model"

test("can be created", () => {
  const instance: AppState = AppStateModel.create({
    toast: { text: "Dummuy Text", styles: "Test Styles" },
  })

  expect(instance).toBeTruthy()
  expect(instance.toast.text).toBe("Dummuy Text")
  expect(instance.toast.styles).toBe("Test Styles")
})

test("can set toast", () => {
  const instance: AppState = AppStateModel.create({ toast: DEFAULT_APPSTATE.toast })
  //call actions to setToast on AppState
  instance.toast.setToast({ text: "this is test msg", styles: "test" })

  expect(instance.toast.text).toBe("this is test msg")
  expect(instance.toast.styles).toBe("test")
})
