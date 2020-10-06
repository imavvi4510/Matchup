import { Platform } from "react-native"

export default {
  isAndroid: Platform.OS === "android",
  logGeneral: true,
  logNetworkErrors: false,
  isTablet: false,
  defaultImage:
    "https://st2.depositphotos.com/1104517/11967/v/950/depositphotos_119675554-stock-illustration-male-avatar-profile-picture-vector.jpg",
  errorMessage: "Oops! There seem to be some error right now. Please try after some time.",
  dateFormatString: "YYYY-MM-DD",
}
