import { observer } from "mobx-react-lite"
import * as React from "react"
import { FormContext, useForm } from "react-hook-form"
import { View } from "react-native"
import { Button } from "react-native-paper"
import { NavigationScreenProp } from "react-navigation"
import { Text } from "../components"
import { FormImagePicker } from "../components/FormComponents/ImagePicker"
import { useStores } from "../models/root-store"
import { spacing } from "../theme"
import axios from "axios"
import { API_URL } from "react-native-dotenv"
import { ERROR_MESSAGE } from "../constants"
import { getProfilePic } from "../utils/links"
export interface AddPictureScreenProps {
  navigation: NavigationScreenProp<{}>
}

export const AddPictureScreen: React.FunctionComponent<AddPictureScreenProps> = observer(
  (props) => {
    const { navigationStore, userProfileForm, appStateStore, authStore, userProfile } = useStores()
    const methods = useForm({
      defaultValues: {
        profilePic: getProfilePic(userProfileForm.profilepic) || "",
      },
    })

    const [isLoading, setLoading] = React.useState(false)

    const onSubmit = () => {
      // validate the image
      const profilePic = methods.watch("profilePic")

      if (!profilePic) {
        // this handles the case when profile pic is "" || undefined || null
        return appStateStore.toast.setToast({
          text: "Please select a profile pic",
          styles: "angry",
        })
      }

      const formData = new FormData()
      Object.keys(userProfileForm).forEach((e) => {
        formData.append(e, userProfileForm[e])
      })

      if (profilePic.name) {
        // proves that profilePic is typeof file
        formData.append("file", profilePic)
      }
      setLoading(true)
      axios
        .request({
          url: "/create/profile",
          baseURL: API_URL,
          data: formData,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
        })
        .then(({ data }) => {
          setLoading(false)
          if (data.filename) {
            userProfileForm.updateProfile({ profilepic: data.filename })
          }
          appStateStore.toast.setToast({
            text: "You are all set. Profile updated successfully",
            styles: "success",
          })
          userProfile.updateProfile(userProfileForm)
          userProfileForm.reset()
          navigationStore.navigateTo("landingScreen")
        })
        .catch((e) => {
          appStateStore.toast.setToast({ text: ERROR_MESSAGE, styles: "angry" })

          setLoading(false)
        })
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: `${spacing[1]}%` }}>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Almost there,
          </Text>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Care to upload profile picture...
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <FormContext {...methods}>
            <FormImagePicker
              name="profilePic"
              handleReject={(text) => appStateStore.toast.setToast({ text, styles: "angry" })}
            />
          </FormContext>
        </View>

        <Button
          style={{ padding: spacing[2], marginTop: spacing[2] }}
          mode="contained"
          onPress={onSubmit}
          disabled={isLoading}
          loading={isLoading}
        >
          Done
        </Button>
      </View>
    )
  },
)
