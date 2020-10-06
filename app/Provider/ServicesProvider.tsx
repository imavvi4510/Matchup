import React from "react"
import { API_URL } from "react-native-dotenv"
import { UseFetchProvider } from "use-fetch-lib"
import { observer } from "mobx-react-lite"
import { useStores } from "../models/root-store"
import axios from "axios"
import { ERROR_MESSAGE } from "../constants"

export const ServicesProvider = observer(({ children }) => {
  const { authStore, navigationStore, appStateStore } = useStores()

  const refreshAuthLogic = (originalRequest) => {
    const expiredToken = originalRequest?.headers?.Authorization || ""

    if (expiredToken) {
      axios
        .request({
          url: `/refreshToken`,
          method: "post",
          baseURL: API_URL,
          headers: {
            Authorization: `${expiredToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then(({ data }) => {
          authStore.setUser(data)
          originalRequest.headers.Authorization = "Bearer " + data.token
          return axios(originalRequest)
        })
        .catch(() => appStateStore.toast.setToast({ text: ERROR_MESSAGE, styles: "angry" }))
    } else {
      navigationStore.navigateTo("authStack")
    }
  }

  React.useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      (error) => {
        const status = error.response.status
        if (status === 401) {
          return refreshAuthLogic(error.config)
        }
        return Promise.reject(error)
      },
    )
  }, [])

  return (
    <UseFetchProvider baseUrl={API_URL} authorizationToken={() => `Bearer ${authStore.token}`}>
      {children}
    </UseFetchProvider>
  )
})
