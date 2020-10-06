import { ViewStyle, Dimensions } from "react-native"
import { spacing } from "../../theme"
const { width } = Dimensions.get("screen")

export const tabBarStyles = {
  WRAPPER: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.68)",
    alignItems: "center",
    alignSelf: "center",
    minWidth: width * 0.7,
    borderRadius: width * 0.3,
    position: "absolute",
    bottom: `${spacing[0]}%`,
  } as ViewStyle,

  ICON_CONTAINER: {
    padding: spacing[3],
    flexDirection: "row",
    alignItems: "center",
  },
}
