import * as React from "react"
import { FormContext, useForm } from "react-hook-form"
import { StyleSheet, View, ImageBackground, StatusBar } from "react-native"
import { Button } from "react-native-paper"
import { NavigationScreenProp } from "react-navigation"
import { Text, DismissKeyboardView } from "../components"
import { FormInput } from "../components/formInput"
import { useStores } from "../models/root-store"
import { spacing, color } from "../theme"
import { withHandleFormReject } from "../hocs/withHandleFormReject"
import * as Yup from "yup"
import { emailValidator } from "../validators/fields"
import { useFetch } from "use-fetch-lib"
import { TERMS_OF_SERVICES, PRIVACY_POLICY } from "../constants"

export interface LoginScreenProps extends NavigationScreenProp<{}> {}

const styles = StyleSheet.create({
  ROOT: {
    justifyContent: "space-between",
    flex: 1,
  },
  LOGO_CONTAINER: {
    alignItems: "center",
    marginVertical: `${spacing[2]}%`,
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: `${spacing[3]}%`,
  },
  INPUT_CONTAINER: {
    flex: 1,
    marginHorizontal: `${spacing[2]}%`,
  },
})

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = () => {
  const { navigationStore, appStateStore, authStore } = useStores()
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: emailValidator,
      password: Yup.string().required(),
    }),
  })

  const [{ data, status }, service] = useFetch<LoginFormResponse>({
    url: "/login",
    method: "post",
  })

  const handleFormSubmit = (data) => {
    service(data)
  }

  React.useEffect(() => {
    if (status.isFulfilled) {
      const { isProfileComplete } = data
      authStore.setUser(data)
      // isProfileComplete
      //   ? navigationStore.navigateTo("primaryStack")
      //   : navigationStore.navigateTo("addPersonalDetails")
      navigationStore.navigateTo("primaryStack")
    }
    if (status.isRejected) {
      appStateStore.toast.setToast({ text: status.err, styles: "angry" })
    }
  }, [status])

  return (
    <ImageBackground
      source={require("../../assets/images/login_image.jpeg")}
      style={{ width: "100%", height: "100%" }}
      blurRadius={2.2}
    >
      <StatusBar backgroundColor={color.primary} barStyle="light-content" />

      <DismissKeyboardView style={{ flex: 1 }}>
        <View style={styles.ROOT}>
          <View style={styles.LOGO_CONTAINER}>
            <Text
              style={{
                fontSize: 55,
              }}
              preset={["header", "white"]}
            >
              Welcome
            </Text>
            <Text style={{ fontSize: 27 }} preset={["white", "center"]}>
              "Sign up for free to connect with the one for you"
            </Text>
          </View>
          <View style={styles.INPUT_CONTAINER}>
            <FormContext {...methods}>
              <FormComponent
                handleFormReject={(text) => appStateStore.toast.setToast({ text, styles: "angry" })}
              />
            </FormContext>

            <Button
              style={{ padding: spacing[2], marginTop: spacing[2] }}
              mode="contained"
              disabled={status.isPending}
              loading={status.isPending}
              onPress={methods.handleSubmit(handleFormSubmit)}
            >
              Sign In
            </Button>
            <Text style={{ marginTop: spacing[3] }} preset={["center", "white"]}>
              <Text>Need help?</Text>
              <Text>&nbsp; &nbsp;|&nbsp; &nbsp;</Text>
              <Text onPress={() => navigationStore.navigateTo("register")}>Register</Text>
            </Text>
          </View>
          <Text style={{ marginBottom: spacing[2] }} preset={["center", "dullWhite", "small"]}>
            By continuing you agree to our{" "}
            <Text preset={["link", "small"]} url={TERMS_OF_SERVICES}>
              terms and conditions
            </Text>{" "}
            and{" "}
            <Text preset={["link", "small"]} url={PRIVACY_POLICY}>
              privacy policy
            </Text>
          </Text>
        </View>
      </DismissKeyboardView>
    </ImageBackground>
  )
}

const FormComponent = withHandleFormReject(() => {
  return (
    <View>
      <FormInput name="email" label="Email" autoCompleteType="email" keyboardType="email-address"/>
      <FormInput name="password" label="Password" secureTextEntry/>
    </View>
  )
})
