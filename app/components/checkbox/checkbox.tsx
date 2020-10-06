import * as React from "react"
import {
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  View,
  StyleSheet,
  LayoutAnimation,
} from "react-native"
import { Text } from "../"
import { color, spacing } from "../../theme"
import { CheckboxProps } from "./checkbox.props"
import { mergeAll, flatten } from "ramda"
import AntIcons from "react-native-vector-icons/AntDesign"

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[2],
  alignSelf: "flex-start",
  alignItems: "center",
  justifyContent: "center",
  //inactiveStyles
  borderWidth: 1,
  borderColor: color.line,
  borderRadius: 2,
}


const LABEL: TextStyle = { paddingLeft: spacing[2] }

export function Checkbox(
  props: CheckboxProps & {
    data: string
  },
) {
  
	const isActive=props.value === props.data ;
	console.log(props.data,'is current',isActive)

  const rootStyle = mergeAll(flatten([ROOT, props.style]))
  const onPress = () => {
    return props.onToggle(props.data)
  }
  return (
    <TouchableOpacity
      activeOpacity={1}
	  onPress={onPress}
      style={[rootStyle, isActive? styles.activeStyles : {}]}
    >
      <Text style={[LABEL, isActive ? styles.activeLabel : {}]}>{props.text}</Text>
      {isActive? (
        <AntIcons name="check" size={25} style={{ marginStart: "auto" }} color={color.primary} />
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  activeStyles: {
    paddingHorizontal: spacing[1],
    borderColor: color.primary,
    elevation: 2,
  },
  activeLabel: {
    color: color.primary,
  },
})
