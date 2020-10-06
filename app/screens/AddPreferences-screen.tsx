import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StatusBar, View, StyleSheet } from "react-native"
import { Screen, Text } from "../components"
import { color, spacing } from "../theme"
import { NavigationScreenProp } from "react-navigation"
import { Checkbox } from "react-native-paper"
import { useStores } from "../models/root-store"
import { MARITAL_STATUS, RELIGION } from "../constants"
import { FlatList } from "react-native-gesture-handler"
import { useFetch } from "use-fetch-lib"
import { SearchBar } from "../components/SearchComponent"

export interface AddPreferencesScreenProps {
  navigation: NavigationScreenProp<{}>
}

const ROOT: ViewStyle = {
  paddingTop: StatusBar.currentHeight + spacing[3],
  paddingHorizontal: spacing[3],
}

const SETTINGS_LIST = ["state", "city", "status", "religion"]

export const AddPreferencesScreen: React.FunctionComponent<AddPreferencesScreenProps> = observer(
  (props) => {
    const [currentStep, setStep] = React.useState("state")
    const { preferenceStore, navigationStore, appStateStore } = useStores()

    const [{ data, status }, sevicesCaller] = useFetch({
      url: "/set/preference",
      method: "post",
    })

    React.useEffect(() => {
      if (status.isFulfilled) {
        appStateStore.toast.setToast({
          text: "You are all set. Preferences updated successfully",
          styles: "success",
        })
        preferenceStore.set("actionComplete", true)
        navigationStore.navigateTo("landingScreen")
      }
    }, [status])

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

    return (
      <Screen style={ROOT} preset="fixed">
        <Text preset={["header", "center"]}>Set your Preference</Text>
        <Text preset={["center"]} style={{ marginTop: spacing[2] }}>
          setting up your preference help us find out your perfect partner faster
        </Text>
        <View style={{ flex: 1, marginHorizontal: spacing[3], marginTop: spacing[8] }}>
          {
            {
              state: (
                <>
                  <SearchBar
                    onChangeText={setStatesQuery}
                    value={statesQuery}
                    placeholder="enter what you are looking for"
                    style={{ marginBottom: spacing[4] }}
                  />

                  <SelectGroup
                    value={preferenceStore.state}
                    onChange={(value) => {
                      preferenceStore.set("state", value.name)
                      setSelectedState(value)
                      preferenceStore.set("city", "")
                    }}
                    options={statesData?.states || []}
                  />
                </>
              ),

              city: (
                <>
                  <SearchBar
                    onChangeText={setCityQuery}
                    value={cityQuery}
                    placeholder="enter what you are looking for"
                    style={{ marginBottom: spacing[4] }}
                  />

                  <SelectGroup
                    value={preferenceStore.city}
                    onChange={(value) => preferenceStore.set("city", value.name)}
                    options={citiesData?.cities || []}
                  />
                </>
              ),
              status: (
                <SelectGroup
                  value={preferenceStore.maritalStatus}
                  onChange={(status) => {
                    preferenceStore.set("maritalStatus", status)
                  }}
                  options={MARITAL_STATUS}
                />
              ),
              religion: (
                <SelectGroup
                  value={preferenceStore.religion}
                  onChange={(status) => {
                    preferenceStore.set("religion", status)
                  }}
                  options={RELIGION}
                />
              ),
            }[currentStep]
          }
        </View>
        <View
          style={{
            marginBottom: spacing[6],
            marginHorizontal: "10%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            preset={["large", currentStep === SETTINGS_LIST[0] ? "muted" : "bold"]}
            onPress={() => {
              if (currentStep !== SETTINGS_LIST[0]) {
                setStep(SETTINGS_LIST[SETTINGS_LIST.indexOf(currentStep) - 1])
              }
            }}
          >
            Back
          </Text>
          <Text
            preset={[status.isPending ? "muted" : "primary", "large", "bold"]}
            onPress={() => {
              if (currentStep !== SETTINGS_LIST[SETTINGS_LIST.length - 1]) {
                setStep(SETTINGS_LIST[SETTINGS_LIST.indexOf(currentStep) + 1])
              } else if (!status.isPending) {
                sevicesCaller(preferenceStore)
              }
            }}
          >
            {currentStep !== SETTINGS_LIST[SETTINGS_LIST.length - 1] ? "Next" : "Done"}
          </Text>
        </View>
        {currentStep === SETTINGS_LIST[SETTINGS_LIST.length - 1] ? (
          <Text
            preset={["primary", "center"]}
            style={{ marginBottom: spacing[2] }}
            onPress={() => navigationStore.navigateTo("Accounts")}
          >
            Click to refine more
          </Text>
        ) : null}
      </Screen>
    )
  },
)

const CheckboxView = ({ status, label, ...rest }) => {
  return (
    <View
      style={{
        borderRadius: 5,
        backgroundColor: status ? color.primary : color.background,
        paddingRight: spacing[1],
        margin: spacing[2],
      }}
    >
      <View
        style={[
          styles.checkboxContainer,
          status ? { borderColor: color.primary } : { borderWidth: 2 },
        ]}
      >
        <Checkbox status={status ? "checked" : "unchecked"} color={color.primary} {...rest} />
        <Text>{label}</Text>
      </View>
    </View>
  )
}

export const SelectGroup = ({ value, onChange, options }) => {
  return (
    <View style={{ flex: 1 }}>
      <Text preset={["large"]} style={{ paddingStart: spacing[2] }}>
        Select one from the list
      </Text>
      <FlatList
        data={options}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: e }) => (
          <CheckboxView
            label={typeof e === "string" ? e : e.name}
            status={typeof e === "string" ? value === e : value === e.name}
            onPress={() => onChange(value === e ? undefined : e)}
          />
        )}
        keyExtractor={(item, index) => `${typeof item === "string" ? item : item.name}-${index}`}
        extraData={value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    borderColor: color.line,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: "row",
    padding: spacing[2],
    alignItems: "center",
    backgroundColor: color.background,
  },
})
