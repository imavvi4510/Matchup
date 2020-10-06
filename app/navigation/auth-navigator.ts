import { createStackNavigator } from "react-navigation-stack"
import { SignupScreen, LoginScreen } from "../screens"

export const AuthNavigator = createStackNavigator(
  {
    register: { screen: SignupScreen },
    login: { screen: LoginScreen },
  },
  {
    initialRouteName: "login",
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
export const exitRoutes = ['login']
