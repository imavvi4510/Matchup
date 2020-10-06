import * as React from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  StatusBar,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from "react-native"
import { Screen, Text, HeartIcon, ExpandebleInput, ExpandAnimation } from "../components"
import { useStores } from "../models/root-store"
import { color, spacing } from "../theme"
import { NavigationScreenProp } from "react-navigation"
import { trimEmail, handleLinkPress } from "../utils/links"
import { PreferenceSnapshot } from "../models/preference"
import { TextInput, Button } from "react-native-paper"
import { useFetch } from "use-fetch-lib"
import {
  ERROR_MESSAGE,
  LOCATIONS,
  MARITAL_STATUS,
  HELP_AND_SUPPORT_LINK,
  PAYMENT_POLICY,
  PRIVACY_POLICY,
  TERMS_OF_SERVICES,
  PAYMENT_LINK,
  RELIGION,
} from "../constants"
import { SelectGroup } from "./AddPreferences-screen"
import RangeSlider from "rn-range-slider"
import { SearchBar } from "../components/SearchComponent"

export interface AccountScreenProps {
  navigation: NavigationScreenProp<{}>
}

const ROOT: ViewStyle = {
  backgroundColor: "#f5f5f5",
  paddingTop: StatusBar.currentHeight,
  flexGrow: 1,
}

export const AccountScreen: React.FunctionComponent<AccountScreenProps> = observer(() => {
  const rootStore = useStores()
  const { authStore, preferenceStore, appStateStore, navigationStore } = rootStore

  const handleSuccess = (msg) => appStateStore.toast.setToast({ text: msg, styles: "success" })
  const handleFailure = (msg = ERROR_MESSAGE) =>
    appStateStore.toast.setToast({ text: msg, styles: "angry" })

  const [{ data: preferences, status: preferenceStaus }] = useFetch({
    url: "/get/preferences",
    method: "get",
    shouldDispatch: true,
    cache: true,
  })

  React.useEffect(() => {
    if (preferenceStaus.isFulfilled) {
      preferenceStore.init(preferences.data)
    }
  }, [preferenceStaus])

  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset={["header", "center"]}>Settings</Text>
      <Text preset={["center", "small"]}>tinker the app according to your needs</Text>
      <StatusBar barStyle="dark-content" />
      <Ads />
      <AccountSection email={authStore.email} onSuccess={handleSuccess} onFailure={handleFailure} />
      <PreferenceSection
        {...preferenceStore}
        onSuccess={(msg) => {
          preferenceStore.set("actionComplete", true)
          handleSuccess(msg)
        }}
        onFailure={handleFailure}
        onChange={preferenceStore.set}
      />
      <ContactUs />
      <Legal />
      <Text
        style={{
          padding: spacing[1],
          marginBottom: spacing[3],
        }}
        onPress={() => {
          navigationStore.navigateTo("login")
          rootStore.resetRoot()
        }}
        preset={["bold", "center", "primary"]}
      >
        Sign out
      </Text>
    </Screen>
  )
})

const Legal = () => {
  return (
    <View style={{ margin: spacing[3] }}>
      <Text preset={["bold", "large"]}>Legal</Text>
      <View
        style={{
          backgroundColor: color.background,
          borderRadius: spacing[1],
          marginVertical: spacing[3],
          padding: spacing[3],
        }}
      >
        <Text style={{ padding: spacing[3] }} onPress={() => handleLinkPress(PAYMENT_POLICY)}>
          Payment Policy
        </Text>
        <Text style={{ padding: spacing[3] }} onPress={() => handleLinkPress(PRIVACY_POLICY)}>
          Privacy Policy
        </Text>
        <Text onPress={() => handleLinkPress(TERMS_OF_SERVICES)} style={{ padding: spacing[3] }}>
          Terms of Services
        </Text>
      </View>
    </View>
  )
}

const ContactUs = () => {
  return (
    <View style={{ margin: spacing[3] }}>
      <Text preset={["bold", "large"]}>Contact us</Text>
      <View
        style={{
          backgroundColor: color.background,
          borderRadius: spacing[1],
          marginVertical: spacing[3],
          padding: spacing[3],
        }}
      >
        <Text preset={["bold", "center"]} onPress={() => handleLinkPress(HELP_AND_SUPPORT_LINK)}>
          Help & Support
        </Text>
      </View>
    </View>
  )
}

const EMPTY_STRING = "Not set"
const RoundedButton = (props: React.ComponentType<Button>) => (
  <Button
    style={{
      marginHorizontal: `${spacing[6]}%`,
      marginVertical: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: spacing[5],
    }}
    mode="contained"
    {...props}
  >
    Done
  </Button>
)

const PreferenceSection = (
  props: PreferenceSnapshot & {
    onChange: Function
    onSuccess: Function
    onFailure: Function
  },
) => {
  const [isDetailed, setIsDetailed] = React.useState(false)

  const prevPreference = React.useRef<PreferenceSnapshot | null>()

  const cityRef = React.useRef(null)
  const stateRef = React.useRef(null)
  const maritalStatusRef = React.useRef(null)
  const ageRef = React.useRef(null)
  const heightRef = React.useRef(null)
  const religionRef = React.useRef(null)

  React.useEffect(() => {
    prevPreference.current = {
      city: props.city,
      state: props.state,
      maritalStatus: props.maritalStatus,
      ageTo: props.ageTo,
      ageFrom: props.ageFrom,
      minHeight: props.minHeight,
      maxHeight: props.maxHeight,
      religion: props.religion,
    }
  }, [])

  const [{ data, status }, sevicesCaller] = useFetch({
    url: "/set/preference",
    method: "post",
  })

  const [statesQuery, setStatesQuery] = React.useState("")
  const [cityQuery, setCityQuery] = React.useState("")
  const [selectedState, setSelectedState] = React.useState(undefined)

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

  React.useEffect(() => {
    if (status.isFulfilled) {
      props.onSuccess("You are all set. Preferences updated successfully")
    } else if (status.isRejected) {
      props.onFailure()
    }
  }, [status])

  const onExpandableStateChange = (isOpening) => {
    if (!isOpening) {
      const preference = {
        city: props.city,
        state: props.state,
        maritalStatus: props.maritalStatus,
        ageTo: props.ageTo,
        ageFrom: props.ageFrom,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
        religion: props.religion,
      }

      if (JSON.stringify(prevPreference.current) !== JSON.stringify(preference)) {
        sevicesCaller(preference)
        prevPreference.current = preference
      }
    }
  }

  return (
    <View style={{ margin: spacing[3] }}>
      <Text preset={["bold", "large"]}>Preferences settings</Text>
      <View
        style={{
          backgroundColor: color.background,
          borderRadius: spacing[1],
          marginVertical: spacing[3],
        }}
      >
        <ExpandebleInput
          title="State"
          value={props.state || EMPTY_STRING}
          onStateChange={onExpandableStateChange}
          ref={stateRef}
        >
          <View style={{ backgroundColor: "#f9f9f9" }}>
            <SearchBar
              onChangeText={setStatesQuery}
              value={statesQuery}
              placeholder="enter what you are looking for"
              style={{ marginTop: spacing[4] }}
            />
            <SelectGroup
              value={props.state}
              onChange={(value) => {
                setSelectedState(value)
                props.onChange("city", undefined)
                props.onChange("state", value.name)
              }}
              options={statesData?.states || []}
            />
            <RoundedButton
              onPress={() => {
                stateRef.current.setExpanded(false)
              }}
            />
          </View>
        </ExpandebleInput>

        <ExpandebleInput
          title="City"
          value={props.city || EMPTY_STRING}
          onStateChange={onExpandableStateChange}
          ref={cityRef}
        >
          <View style={{ backgroundColor: "#f9f9f9" }}>
            <SearchBar
              onChangeText={setCityQuery}
              value={cityQuery}
              placeholder="enter what you are looking for"
              style={{ marginTop: spacing[4] }}
            />

            <SelectGroup
              value={props.city}
              onChange={(value) => props.onChange("city", value.name)}
              options={citiesData?.cities || []}
            />
            <RoundedButton
              onPress={() => {
                cityRef.current.setExpanded(false)
              }}
            />
          </View>
        </ExpandebleInput>
        <ExpandebleInput
          title="Marital status"
          onStateChange={onExpandableStateChange}
          value={props.maritalStatus || EMPTY_STRING}
          ref={maritalStatusRef}
        >
          <View style={{ backgroundColor: "#f9f9f9" }}>
            <SelectGroup
              value={props.maritalStatus}
              onChange={(value) => props.onChange("maritalStatus", value)}
              options={MARITAL_STATUS}
            />
            <RoundedButton
              onPress={() => {
                maritalStatusRef.current.setExpanded(false)
              }}
            />
          </View>
        </ExpandebleInput>

        {isDetailed ? (
          <View>
            <ExpandebleInput
              title="Age"
              onStateChange={onExpandableStateChange}
              value={props.ageTo ? `${props.ageFrom}-${props.ageTo}` : EMPTY_STRING}
              ref={ageRef}
            >
              <View>
                <Slider
                  msg="Please select the age(in years) from slider"
                  isSelected={props.ageTo}
                  min={18}
                  max={80}
                  initialLowValue={props.ageFrom}
                  initialHighValue={props.ageTo}
                  onValueChanged={(low, high) => {
                    props.onChange("ageFrom", low)
                    props.onChange("ageTo", high)
                  }}
                />

                <RoundedButton
                  onPress={() => {
                    ageRef.current.setExpanded(false)
                  }}
                />
              </View>
            </ExpandebleInput>
            <ExpandebleInput
              onStateChange={onExpandableStateChange}
              title="Height"
              value={props.maxHeight ? `${props.minHeight}-${props.maxHeight}` : EMPTY_STRING}
              ref={heightRef}
            >
              <View>
                <Slider
                  msg="Please select the height(in feet) from slider"
                  isSelected={props.ageTo}
                  min={0}
                  max={7}
                  step={1}
                  initialLowValue={props.minHeight}
                  initialHighValue={props.maxHeight}
                  onValueChanged={(low, high) => {
                    props.onChange("minHeight", low)
                    props.onChange("maxHeight", high)
                  }}
                />
                <RoundedButton
                  onPress={() => {
                    heightRef.current.setExpanded(false)
                  }}
                />
              </View>
            </ExpandebleInput>

            <ExpandebleInput
              title="Religion"
              onStateChange={onExpandableStateChange}
              value={props.religion || EMPTY_STRING}
              ref={religionRef}
            >
              <View style={{ backgroundColor: "#f9f9f9" }}>
                <SelectGroup
                  value={props.religion}
                  onChange={(value) => props.onChange("religion", value)}
                  options={RELIGION}
                />
                <RoundedButton
                  onPress={() => {
                    religionRef.current.setExpanded(false)
                  }}
                />
              </View>
            </ExpandebleInput>
          </View>
        ) : null}
      </View>
      <Text
        preset={["muted"]}
        style={{ alignSelf: "flex-end" }}
        onPress={() => {
          ExpandAnimation()
          setIsDetailed(!isDetailed)
        }}
      >
        {isDetailed ? "view less" : "view more"}
      </Text>
    </View>
  )
}

const Slider = ({ msg, onValueChanged, ...rest }) => {
  const [isSelected, setSelected] = React.useState(rest.initialLowValue)
  return (
    <TouchableWithoutFeedback>
      <View style={{ alignItems: "center" }}>
        <Text style={{ position: "absolute" }}>{msg}</Text>
        <RangeSlider
          style={{ width: "80%", height: 80 }}
          gravity={"center"}
          step={2}
          selectionColor={isSelected ? color.primary : color.line}
          blankColor={color.palette.black}
          onValueChanged={(low, high, fromUser) => {
            if (low !== rest.min || high !== rest.max) {
              onValueChanged(low, high)
              setSelected(true)
            } else {
              setSelected(false)
              onValueChanged(undefined, undefined)
            }
          }}
          {...rest}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const AccountSection = ({ email, onSuccess, onFailure }) => {
  const [newPassword, setNewPassword] = React.useState("")
  const [{ status }, services] = useFetch({ url: "/set/password", method: "post" })

  const passwordExpandableRef = React.useRef(null)

  React.useEffect(() => {
    if (status.isFulfilled) {
      passwordExpandableRef.current.setExpanded(false)
      onSuccess("Password updated successfully")
    } else if (status.isRejected) onFailure()
  }, [status])

  return (
    <View style={{ margin: spacing[3] }}>
      <Text preset={["bold", "large"]}>Account settings</Text>
      <View
        style={{
          backgroundColor: color.background,
          borderRadius: spacing[1],
          marginVertical: spacing[3],
        }}
      >
        <ExpandebleInput title="Email" value={trimEmail(email)}></ExpandebleInput>
        <ExpandebleInput
          title="Password"
          ref={passwordExpandableRef}
          value={"*****"}
          isDisabled={status.isPending}
          onStateChange={() => setNewPassword("")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              label="New Password"
              style={{ height: 50, margin: spacing[3], flex: 1 }}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Button
              compact={true}
              loading={status.isPending}
              disabled={status.isPending}
              onPress={() => {
                if (newPassword) {
                  services({ newPassword })
                } else {
                  passwordExpandableRef.current.setExpanded(false)
                }
              }}
            >
              {newPassword ? "done" : "close"}
            </Button>
          </View>
        </ExpandebleInput>
      </View>
    </View>
  )
}

const Ads = () => {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(PAYMENT_LINK)}
      style={{
        padding: spacing[3],
        margin: spacing[3],
        backgroundColor: color.background,
        borderRadius: spacing[3],
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <HeartIcon color="lightgreen" size={25} style={{ marginHorizontal: spacing[4] }} />
        <Text preset={["text", "bold"]}>Increase Your Chances</Text>
      </View>
      <Text preset="center">Get unlimited likes with premium</Text>
    </TouchableOpacity>
  )
}
