import React, { useState } from "react"
import { Controller } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import ImagePickerLib from "react-native-image-picker"
import { Avatar } from "react-native-paper"
import { errorMessage } from "../../utils/errorMessages"
import { spacing } from "../../theme"

export interface File {
  uri: string
  size: number
  name: string
  type: string
}

const emptyImage =
  "https://previews.123rf.com/images/blankstock/blankstock1811/blankstock181101708/112886250-add-user-line-icon-profile-avatar-sign-male-person-silhouette-symbol-gradient-pattern-line-button-ad.jpg"

export const FormImagePicker = ({ name, defaultValue, control, ...rest }) => {
  return (
    <Controller
      as={<ImagePicker {...rest} />}
      name={name}
      valueName="source"
      onChangeName="setSource"
      {...{ defaultValue, control }}
    />
  )
}

const getSource = (source, defaultImag) => {
  return typeof source?.name === "string" // is file
    ? { uri: source.uri }
    : typeof source === "string" && source // is string
      ? { uri: source }
      : { uri: defaultImag }
}

const imagePickerOptions = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  rotation: 0,
}

export const ImagePicker = ({ source, handleReject, children, setSource, maxSize = 1 }) => {
  const [isEmpty, setIsEmpty] = useState(true)

  const handleImage = (selection: any) => {
    // handle cancel
    try {
      if (selection.didCancel) {
        throw new Error("Image selection canceled by user")
      }
      // handle error
      else if (selection.error) {
        throw new Error(errorMessage(selection.error))
      }
      // handle image size errors
      else if (selection.fileSize > maxSize * 1000 * 1000) {
        throw new Error(`Must be less than ${maxSize}MB`)
      }
      // set image
      else {
        setSource({
          name: selection.fileName,
          type: selection.type,
          uri: selection.uri,
        } as File)
      }
    } catch (e) {
      handleReject(errorMessage(e))
    }
  }

  const openPicker = () => {
    ImagePickerLib.showImagePicker(imagePickerOptions, handleImage)
  }

  React.useEffect(() => {
    if (typeof source?.name === "string") setIsEmpty(false)
    else if (typeof source === "string" && source !== "profile.png" && source) setIsEmpty(false)
  }, [source])

  return children ? (
    children({ source: getSource(source), openPicker, isEmpty })
  ) : (
    <View style={{ alignContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#000000",
          padding: `${spacing[3]}%`,
          borderRadius: 5,
        }}
        onPress={openPicker}
      >
        <Avatar.Image
          size={200}
          source={getSource(source, emptyImage)}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
    </View>
  )
}
