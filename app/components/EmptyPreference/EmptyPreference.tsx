import * as React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "../"
import { emptyPreferenceStyles as styles } from "./EmptyPreference.styles"
import { useStores } from "../../models/root-store"
import { spacing } from "../../theme"

export interface EmptyPreferenceProps {
  message: string
}

/**
 * React.FunctionComponent for your hook(s) needs
 *
 * Component description here for TypeScript tips.
 */
export const EmptyPreference: React.FunctionComponent<EmptyPreferenceProps> = (props) => {
  const { navigationStore } = useStores()

  return (
    <View style={styles.WRAPPER}>
      <Text style={{ flex: 1 }} preset={["text"]} onPress={() => console.log("i am here")}>
        {props.message}
        <Text onPress={() => console.log("this is touching")} preset={["bold", "primary"]}>
          Click to proceed
        </Text>
      </Text>
    </View>
  )
}
