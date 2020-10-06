import { createSwitchNavigator } from "react-navigation"
import { AuthNavigator } from "./auth-navigator"
import { CreateProfileNavigator } from "./createProfile-navigator"
import { PrimaryNavigator } from "./primary-navigator"

export const RootNavigator = createSwitchNavigator(
  {
    authStack: { screen: AuthNavigator },
    primaryStack: { screen: PrimaryNavigator },
    createProfileStack: { screen: CreateProfileNavigator },
  },
  {
    navigationOptions: {
      gesturesEnabled: false,
    },
    initialRouteName: "authStack",
  },
)

