import { observer } from "mobx-react-lite"
import * as React from "react"
import { FormContext, useForm, useFormContext } from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { NavigationScreenProp } from "react-navigation"
import { Text } from "../components"
import { FormInput, FormTextArea } from "../components/formInput"
import { useStores } from "../models/root-store"
import { spacing } from "../theme"
import { IFamilyDetailsShape } from "./types"
import { familyDetailShape } from "../validators/shapes"
import { withHandleFormReject } from "../hocs/withHandleFormReject"

export interface FamilyDetailsScreenProps {
  navigation: NavigationScreenProp<{}>
}

const defaultData: IFamilyDetailsShape = {
  fatherprofession: "",
  motherprofession: "",
  expectations: "",
  parentsmob1: "",
  parentsmob2: "",
}

const getFamilyDetails = (object) =>
  (({ fatherprofession, motherprofession, expectations, parentsmob1, parentsmob2 }) => ({
    fatherprofession,
    motherprofession,
    parentsmob2,
    parentsmob1,
    expectations,
  }))(object)

const getCleanFormData = (data) => {
  return data
}

export const FamilyDetailsScreen: React.FunctionComponent<FamilyDetailsScreenProps> = observer(
  (props) => {
    const { navigationStore, userProfileForm, appStateStore } = useStores()
    const methods = useForm({
      defaultValues: { ...defaultData, ...getFamilyDetails(userProfileForm) },
      validationSchema: familyDetailShape,
    })

    React.useEffect(() => {
      methods.reset({ ...defaultData, ...getFamilyDetails(userProfileForm) })
    }, [userProfileForm])

    const onFormSubmit = (data) => {
      const cleanFormData = getCleanFormData(data)
      userProfileForm.updateProfile(cleanFormData)
      navigationStore.navigateTo("addPictureScreen")
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.rootContainer}>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Tell us to your family and idea of marriage
          </Text>
          <FormContext {...methods}>
            <PersonalDetailsForm
              handleFormReject={(text) => appStateStore.toast.setToast({ text, styles: "angry" })}
            />
          </FormContext>
        </ScrollView>
        <Button
          style={{ padding: spacing[2], marginTop: spacing[2] }}
          mode="contained"
          onPress={methods.handleSubmit(onFormSubmit)}
        >
          Next
        </Button>
      </View>
    )
  },
)

const PersonalDetailsForm = withHandleFormReject(() => {
  const methods = useFormContext()

  return (
    <View style={styles.personalFormContainer}>
      <FormInput
        label="Father Profession"
        name="fatherprofession"
        placeholder="Tell us about your father profession"
        required
      />
      <FormInput
        label="Mother Profession"
        name="motherprofession"
        placeholder="Tell us about your mother profession"
        required
      />

      <FormTextArea
        name="expectations"
        label="Expectations"
        placeholder="What is your take on idea of marriage?"
        required
      />

      <FormInput
        name="parentsmob1"
        label="Your Mobile Number"
        placeholder="Enter your contact number"
        mask="(+91) [0000] [000] [000]"
      />

      <FormInput
        name="parentsmob2"
        label="Your Parent's Contact Number"
        placeholder="Enter your parents contact number"
        mask="(+91) [0000] [000] [000]"
      />
    </View>
  )
})

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: "white",
    padding: `${spacing[1]}%`,
  },
  personalFormContainer: {
    paddingVertical: spacing[3],
  },
})
