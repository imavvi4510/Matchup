import { createStackNavigator } from "react-navigation-stack"
import {
  AddPersonalDetailsScreen,
  ProfessionalDetailsScreen,
  FamilyDetailsScreen,
  AddPictureScreen,
} from "../screens"
import { StatusBar } from "react-native"

export const CreateProfileNavigator = createStackNavigator(
  {
    addPersonalDetails: {
      screen: AddPersonalDetailsScreen,
    },
    professionalDetails: {
      screen: ProfessionalDetailsScreen,
    },
    familyDetails: { screen: FamilyDetailsScreen },
    addPictureScreen: { screen: AddPictureScreen },
  },
  {
    initialRouteName: "addPersonalDetails",
    headerMode: "none",
    defaultNavigationOptions: {
      cardStyle: {
        paddingTop: StatusBar.currentHeight,
      },
    },
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["addPersonalDetails"]
