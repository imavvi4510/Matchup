import { observer } from "mobx-react-lite"
import * as React from "react"
import { Controller, FormContext, useForm, useFormContext } from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { NavigationScreenProp } from "react-navigation"
import { Checkbox, Text } from "../components"
import { FormPicker } from "../components/FormComponents/FormPicker"
import { FormInput } from "../components/formInput"
import { useStores } from "../models/root-store"
import { spacing } from "../theme"
import { IAddProfessinolDetailShape } from "./types"
import { SALARY } from "../constants"
import { addProfessinolDetails } from "../validators/shapes"
import {withHandleFormReject} from "../hocs/withHandleFormReject"
export interface ProfessionalDetailsScreenProps {
  navigation: NavigationScreenProp<{}>
}

const defaultData: IAddProfessinolDetailShape = {
  profession: "",
  officename: "",
  salary: "",
  education: "",
}

const getProfessinolDetails = (object) =>
  (({ profession, officename, salary, education }) => ({
    profession,
    officename,
    salary: salary,
    education,
  }))(object)

const getCleanFormData = (data) => {
  const { salary, ...rest } = data
  return {
    ...rest,
    salary: Number(salary),
  }
}

export const ProfessionalDetailsScreen: React.FunctionComponent<ProfessionalDetailsScreenProps> = observer(
  (props) => {
    const { navigationStore, userProfileForm, appStateStore } = useStores()
    const methods = useForm({
      defaultValues: { ...defaultData, ...getProfessinolDetails(userProfileForm) },
      validationSchema: addProfessinolDetails,
    })

    const onFormSubmit = (data) => {
      const cleanData = getCleanFormData(data)
      userProfileForm.updateProfile(cleanData)
      navigationStore.navigateTo("familyDetails")
    }

    React.useEffect(() => {
      methods.reset({ ...defaultData, ...getProfessinolDetails(userProfileForm) })
    }, [userProfileForm])

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.rootContainer}>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Lets build some ground about your professional life...
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
        name="profession"
        label="Profession"
        placeholder="Tell us about your profession"
        required
      />
      <FormInput
        name="officename"
        label="Company Name"
        placeholder="What is name of company you work with?"
        required
      />

      <FormPicker name="salary" label="Salary" list={SALARY} />

      <FormInput
        label="Education"
        name="education"
        placeholder="What is highest educational qualificatio you have?"
        required
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
