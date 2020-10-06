import { ViewStyle } from "react-native"
import { spacing } from "../../theme"

export const emptyPreferenceStyles = {
  WRAPPER: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0.2,
      height: 0.5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 2,
    padding: spacing[3],
    marginTop: spacing[2],
    marginBottom: spacing[3],
    borderRadius: 8,
    flexDirection: "row",
  } as ViewStyle,
}
