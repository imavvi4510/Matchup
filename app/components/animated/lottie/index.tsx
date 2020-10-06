import React, { ComponentProps } from "react"
import LottieView from "lottie-react-native"

type ILottieComponent = Omit<ComponentProps<typeof LottieView>, 'source'>

export const HeartLottie = (props: ILottieComponent) => (
  <LottieView source={require("../../../../assets/lottie/hearts.json")} autoPlay loop {...props} />
)

export const EmptySearch = (props: ILottieComponent) => (
  <LottieView source={require("../../../../assets/lottie/empty-search.json")} autoPlay loop {...props} />
)
