import * as React from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native"
import { Text } from "../components"
import { useStores } from "../models/root-store"
import { color, spacing } from "../theme"
import { NavigationScreenProp } from "react-navigation"
import { Button } from "react-native-paper"
import { useFetch } from "use-fetch-lib"
import { FormImagePicker } from "../components/FormComponents/ImagePicker"
import { useForm, FormContext } from "react-hook-form"
import { getProfilePic } from "../utils/links"
import isEmpty from "ramda/es/isEmpty"

const { width, height } = Dimensions.get("window")

export interface AddMediaScreenProps {
  navigation: NavigationScreenProp<{}>
}

const cleanDataForForm = ({ photo, photo2, photo3, photo4, photo5 }) => ({
  photo: photo && photo !== "profile.png" ? getProfilePic(photo) : "",
  photo2: photo2 && photo2 !== "profile.png" ? getProfilePic(photo2) : "",
  photo3: photo3 && photo3 !== "profile.png" ? getProfilePic(photo3) : "",
  photo4: photo4 && photo4 !== "profile.png" ? getProfilePic(photo4) : "",
  photo5: photo5 && photo5 !== "profile.png" ? getProfilePic(photo5) : "",
})

export const AddMediaScreen: React.FunctionComponent<AddMediaScreenProps> = observer((props) => {
  const { userProfile, appStateStore, navigationStore } = useStores()
  const methods = useForm({
    defaultValues: {
      photo: getProfilePic(userProfile.profilepic) || "",
      photo2: "",
      photo3: "",
      photo4: "",
      photo5: "",
    },
  })
  const [profilepic, setProfilePic] = React.useState("photo")

  const [{ data, status }] = useFetch({
    url: "/get/mymedia",
    method: "get",
    shouldDispatch: true,
  })

  const [{ data: uploadResponse, status: uploadStatus }, serviceCaller] = useFetch({
    url: "/set/mymedia",
    method: "post",
  })

  React.useEffect(() => {
    if (status.isFulfilled && data?.media) {
      const formData = cleanDataForForm(data.media)
      methods.reset(formData)
      setProfilePic(
        Object.keys(data.media).find((keyname) => data.media[keyname] === userProfile.profilepic),
      )
    }
  }, [status])

  React.useEffect(() => {
    if (uploadStatus.isFulfilled && uploadResponse) {
      userProfile.updateProfile({ profilepic: uploadResponse.profilepic })
      appStateStore.toast.setToast({
        text: "You are all set. Profile updated successfully",
        styles: "success",
      })
      navigationStore.navigateTo("landingScreen")
    }
  }, [uploadStatus])

  const onSubmit = (data = {}) => {
    const formData = new FormData()
    Object.keys(data).map((element) => {
      if (data[element].name) formData.append(element, data[element])
      else if (data[element] && typeof data[element] === "string") {
        const arr = data[element].split("/")
        formData.append(element, arr[arr.length - 1])
      }
    })
    formData.append("profilepic", profilepic)
    serviceCaller(formData)
  }

  const pictures = methods.watch()

  return (
    <View style={styles.container}>
      <View style={styles.imageDropContainer}>
        <Text preset={["header", "center"]}>Add Media</Text>
        <Text preset={["muted", "center"]} style={{ marginBottom: spacing[3] }}>
          Add images or hold them to set as profile pic
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            marginHorizontal: `${spacing[3]}%`,
          }}
        >
          <FormContext {...methods}>
            {Object.keys(pictures).map((pic, index, array) => (
              <FormImagePicker
                key={pic}
                name={pic}
                handleReject={(text) => appStateStore.toast.setToast({ text, styles: "angry" })}
              >
                {({ source, openPicker, isEmpty }) => (
                  <ImageDropPicker
                    {...{ source, openPicker, isEmpty }}
                    isProfilePic={pic === profilepic}
                    setAsProfilePic={() => {
                      if (!isEmpty) setProfilePic(pic)
                      else {
                        appStateStore.toast.setToast({
                          text: "Cannot set an empty image as profile pic",
                          styles: "angry",
                        })
                      }
                    }}
                    isDisabled={index > 0 && !pictures[array[index - 1]]}
                  />
                )}
              </FormImagePicker>
            ))}
          </FormContext>
        </View>
      </View>
      <Button
        style={{ padding: spacing[2], marginTop: spacing[2] }}
        mode="contained"
        loading={uploadStatus.isPending}
        disabled={uploadStatus.isPending}
        onPress={methods.handleSubmit(onSubmit)}
      >
        <Text>Done</Text>
      </Button>
    </View>
  )
})

const ImageDropPicker = ({
  source,
  openPicker,
  isProfilePic,
  setAsProfilePic,
  isDisabled,
  isEmpty,
}) => {
  const showAdd = isEmpty && !isDisabled
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        marginBottom: `${spacing[1]}%`,
        marginHorizontal: `${spacing[1]}%`,
      }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#000000",
          borderRadius: 5,
          minWidth: width * 0.23,
          minHeight: 150,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={openPicker}
        onLongPress={setAsProfilePic}
        disabled={isDisabled}
      >
        <Image
          source={showAdd ? require("../../assets/images/plus-sign.png") : source}
          style={{
            width: showAdd ? 50 : width * 0.23,
            height: showAdd ? 50 : 150,
          }}
        />
        {isProfilePic && (
          <Image
            source={require("../../assets/images/profileIndicator.png")}
            style={{ width: 20, height: 20, position: "absolute", top: 5, left: 5 }}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  imageDropContainer: {
    flex: 1,
    marginTop: `${spacing[3]}%`,
    alignItems: "center",
  },
})
