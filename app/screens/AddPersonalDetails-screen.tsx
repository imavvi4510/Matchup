import { observer } from "mobx-react-lite"
import moment from "moment"
import * as React from "react"
import { FormContext, useForm, useFormContext } from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { NavigationScreenProp } from "react-navigation"
import { Text } from "../components"
import { FormDatePicker } from "../components/FormComponents/DateInput"
import { FormPicker } from "../components/FormComponents/FormPicker"
import { FormInput, FormTextArea } from "../components/formInput"
import { useStores } from "../models/root-store"
import { spacing } from "../theme"
import { addPersonalDetailsForm } from "../validators/shapes"
import { withHandleFormReject } from "../hocs/withHandleFormReject"
import { IAddPersonalDetailShape } from "./types"
import { BLOODGROUP, COMPLEXION, LOCATIONS, MARITAL_STATUS } from "../constants"
import { FormSearchView, SearchPlaceItem } from "../components/FormComponents/SearchInput"
import { useFetch } from "use-fetch-lib"

export interface AddPersonalDetailsScreenProps extends NavigationScreenProp<{}> {}

const defaultData: IAddPersonalDetailShape = {
  gender: "",
  location: "Pune",
  age: "",
  height: "",
  weight: "",
  complexion: "",
  bloodgroup: "",
  hobbies: "",
  address: "",
  physically: "",
  dob: "",
  maritalstatus: "Single",
  religion: "",
}

const getPersonalDetails = (object) =>
  (({
    gender,
    location,
    age,
    height,
    weight,
    complexion,
    bloodgroup,
    hobbies,
    address,
    physically,
    dob,
    maritalstatus,
    religion,
    state,
    city,
  }) => ({
    gender,
    location,
    age: `${age}`,
    height: `${height}`,
    weight: `${weight}`,
    complexion,
    bloodgroup,
    hobbies,
    address,
    physically,
    dob,
    maritalstatus,
    religion,
    state: {
      value: state,
    },
    city: {
      value: city,
    },
  }))(object)

const getCleanFormData = (data) => {
  const { age, height, weight, state, city, ...rest } = data
  return {
    ...rest,
    age: Number(age.split(" ")[0]),
    weight: Number(weight),
    height: parseFloat(height.replace("' ", ".")),
    state: state?.value ?? "",
    city: city?.value ?? "",
  }
}

export const AddPersonalDetailsScreen: React.FunctionComponent<AddPersonalDetailsScreenProps> = observer(
  (props) => {
    const { navigationStore, authStore, appStateStore, userProfileForm } = useStores()
    const methods = useForm({
      defaultValues: { ...defaultData, ...getPersonalDetails(userProfileForm) },
      validationSchema: addPersonalDetailsForm,
    })

    React.useEffect(() => {
      methods.reset({ ...defaultData, ...getPersonalDetails(userProfileForm) })
    }, [userProfileForm])

    const onFormSubmit = (data) => {
      const cleanData = getCleanFormData(data)
      userProfileForm.updateProfile(cleanData)
      navigationStore.navigateTo("professionalDetails")
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.rootContainer}>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Hi {authStore.firstName},
          </Text>
          <Text style={{ fontSize: 28 }} preset={["header"]}>
            Tell us more about yourself...
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
  const [statesQuery, setStatesQuery] = React.useState("")
  const [cityQuery, setCityQuery] = React.useState("")

  const { watch, setValue, errors } = useFormContext()
  const [selectedState, setSelectedState] = React.useState(undefined)

  React.useEffect(() => {
    setSelectedState(watch("state"))
  }, [watch("state")])

  const [{ data: statesData }] = useFetch({
    url: `/get/states?match=${statesQuery}`,
    method: "get",
    dependencies: [statesQuery],
  })

  const [{ data: citiesData }] = useFetch({
    url: `/get/city?match=${cityQuery}&sid=${selectedState?.id}`,
    method: "get",
    dependencies: [cityQuery, selectedState?.id],
  })

  return (
    <View style={styles.personalFormContainer}>
      <FormPicker name="gender" label="Select your gender" list={["male", "female"]} />

      <FormDatePicker
        label="Date of birth"
        placeholder="Pick your date of birth"
        maximumDate={new Date(moment(new Date()).subtract(18, "year").format())}
        minimumDate={new Date(moment(new Date()).subtract(150, "year").format())}
        name="dob"
      />

      <FormInput
        name="age"
        label="Age"
        placeholder="What is your age?"
        required
        mask={"[00] Years"}
        keyboardType="numeric"
      />

      <FormInput
        name="height"
        label="Height"
        placeholder="What is your height?"
        required
        mask="[0]' [09]"
        keyboardType="numeric"
      />

      <FormInput
        name="weight"
        label="Weight (in kg)"
        placeholder="What is your Weight?"
        required
        keyboardType="numeric"
        mask="[009]"
      />

      <FormPicker name="complexion" label="Complexion" list={COMPLEXION} />

      <FormPicker name="maritalstatus" label="Marital Status" list={MARITAL_STATUS} />

      <FormPicker name="bloodgroup" label="Blood Group" list={BLOODGROUP} />

      <FormPicker label="Physically Challenged" name="physically" list={["Yes", "No"]} />

      <FormInput
        name="hobbies"
        label="Hobbies"
        placeholder="Tell us what you enjoy doing"
        required
      />

      <FormInput name="religion" label="Religion" placeholder="Select your religion" required />

      <FormSearchView
        label="State"
        placeholder="Pick your state"
        name="state"
        errorMessage={errors?.state?.value?.message}
        data={statesData?.states || []}
        handleQuery={setStatesQuery}
        renderItem={(eleProps) => <Text style={eleProps.style}>{eleProps?.value?.value}</Text>}
        renderListItem={({ item, onSelectValue }) => (
          <SearchPlaceItem
            {...item}
            handleSelect={(data) => {
              setValue("city", undefined)
              onSelectValue(data)
            }}
          />
        )}
      />

      <FormSearchView
        label="City"
        placeholder="Pick your city"
        name="city"
        errorMessage={errors?.city?.value?.message}
        data={citiesData?.cities || []}
        handleQuery={setCityQuery}
        renderItem={(eleProps) => <Text style={eleProps.style}>{eleProps?.value?.value}</Text>}
        renderListItem={({ item, onSelectValue }) => (
          <SearchPlaceItem
            {...item}
            handleSelect={(data) => {
              onSelectValue(data)
            }}
          />
        )}
      />

      <FormTextArea
        name="address"
        label="Address"
        placeholder="What is your current address?"
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
