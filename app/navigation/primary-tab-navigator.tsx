import React from "react"
import { createBottomTabNavigator } from "react-navigation-tabs"
import { LandingScreen, PeopleScreen, ProfileScreen } from "../screens"
import { SearchIcon, ChatIcon, Face, Text } from "../components"
import { color } from "../theme"
import { View } from "react-native"

const TabLabel = ({ children, tintColor }) => (
  <View pointerEvents="none">
    <Text style={{ color: tintColor }} preset={["small", "center"]}>
      {children}
    </Text>
  </View>
)

export const PrimaryTabNavigator = createBottomTabNavigator(
  {
    landing: { screen: LandingScreen },
    chat: { screen: PeopleScreen },
    myprofile: { screen: ProfileScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        if (routeName === "landing") {
          return <SearchIcon color={tintColor} />
        } else if (routeName === "chat") {
          return <ChatIcon color={tintColor} />
        } else if (routeName === "myprofile") {
          return <Face color={tintColor} />
        }
      },
      tabBarLabel: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        if (routeName === "landing") {
          return <TabLabel {...{ tintColor }}>Explore</TabLabel>
        } else if (routeName === "chat") {
          return <TabLabel {...{ tintColor }}>Connect</TabLabel>
        } else if (routeName === "myprofile") {
          return <TabLabel {...{ tintColor }}>Profile</TabLabel>
        }
      },
    }),

    tabBarOptions: {
      activeTintColor: color.primary,
      inactiveTintColor: color.dim,
    },
  },
)
