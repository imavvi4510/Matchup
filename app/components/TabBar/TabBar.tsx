import * as React from "react"
import { View, LayoutAnimation } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationState, SceneRendererProps } from "react-native-tab-view"
import { Text } from "../"
import { spacing } from "../../theme"
import { tabBarStyles as styles } from "./TabBar.styles"
import { NavigationStateType } from "../../navigation"

export interface TabBarProps extends SceneRendererProps, NavigationState<NavigationStateType> {}

/**
 * React.FunctionComponent for your hook(s) needs
 *
 * Component description here for TypeScript tips.
 */

export const TabBarIconContainer = ({ children, onPress, tabName, isActive = false }) => {
  return (
    <TouchableOpacity style={[styles.ICON_CONTAINER]} onPress={onPress}>
      {children}
      {isActive && (
        <Text preset={["primary", "bold"]} style={{ marginHorizontal: spacing[2] }}>
          {tabName}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export const TabBar: React.FunctionComponent<TabBarProps> = (props) => {
  // const { someStore } = useStores()

  return (
    <View style={styles.WRAPPER}>
      {props.navigationState.routes.map((route, i) => {
        return (
          <TabBarIconContainer
            tabName={route.title}
            key={route.key}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  200,
                  LayoutAnimation.Types.linear,
                  LayoutAnimation.Properties.scaleXY,
                ),
              )
              props.jumpTo(route.key)
            }}
            isActive={i === props.navigationState.index}
          >
            {route.icon()}
          </TabBarIconContainer>
        )
      })}
    </View>
  )
}
