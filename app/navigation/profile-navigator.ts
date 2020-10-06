import { createSharedElementStackNavigator } from "react-navigation-shared-element"
import { DemoScreen, WelcomeScreen } from "../screens"

export const ProfileNavigator = createSharedElementStackNavigator(
  {
    welcome: { screen: WelcomeScreen },
    demo: { screen: DemoScreen },
  },
  {
    initialRouteName: "welcome",
    headerMode: "none",
  },
)

