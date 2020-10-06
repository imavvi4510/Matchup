import React, { useEffect } from "react"
import {
  LandingScreen,
  ProfileScreen,
  ChatScreen,
  AddMediaScreen,
  AddPreferencesScreen,
  AccountScreen,
  PeopleScreen,
} from "../screens"
import { ProfileNavigator } from "./profile-navigator"
import { createStackNavigator } from "react-navigation-stack"
import { NavigationState } from "react-native-tab-view"
import { View, StatusBar } from "react-native"
import { CreateProfileNavigator } from "./createProfile-navigator"
import EventSource from "react-native-event-source"
import { API_URL } from "react-native-dotenv"
import { observer } from "mobx-react-lite"
import { useStores } from "../models/root-store"
import { PrimaryTabNavigator } from "./primary-tab-navigator"

type Route = {
  key: string
  title: string
  icon: string
}

export type NavigationStateType = NavigationState<Route>

export const PrimaryNavigatorTabs = observer((props) => {
  const { authStore, actionStore } = useStores()

  const handleEvent = (data) => {
    actionStore.addAppActions(JSON.parse(data.data))
  }

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/events?email=${authStore.email}`)

    eventSource.addEventListener("message", (message) => {
      handleEvent(message)
    })

    return () => {
      eventSource.removeAllListeners()
      eventSource.close()
    }
  }, [])

  return (
    <View style={{ paddingTop: StatusBar.currentHeight, flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <PrimaryTabNavigator navigation={props.navigation}/>
    </View>
  )
})

PrimaryNavigatorTabs.router = PrimaryTabNavigator.router

export const PrimaryNavigator = createStackNavigator(
  {
    landingScreen: { screen: PrimaryNavigatorTabs },
    profile: { screen: ProfileNavigator },
    updateProfile: { screen: CreateProfileNavigator },
    addMediaScreen: { screen: AddMediaScreen },
    SetPreferences: { screen: AddPreferencesScreen },
    Accounts: { screen: AccountScreen },
  },
  {
    navigationOptions: { gesturesEnabled: false },
    initialRouteName: "landingScreen",
    headerMode: "none",
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["landing"]
