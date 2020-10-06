import { Animated, Easing } from "react-native"
import { SceneInterpolatorProps } from "react-navigation-stack/lib/typescript/types"

type ISliderFunction = (
  index: number,
  position: Animated.AnimatedInterpolation,
  dimension: number,
) => Object
// This should be some viewStyles object but currently we cannot assert that
//source: https://stackoverflow.com/questions/51521809/typescript-definitions-for-animated-views-style-prop

export const SlideFromRight: ISliderFunction = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [width, 0],
  })
  return { transform: [{ translateX }] }
}

export type ITransitions = "default" | "bottomTransition" | "topTransition"

export const SlideFromBottom: ISliderFunction = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  })
  return { transform: [{ translateY }] }
}

export const SlideFromTop: ISliderFunction = (index, position, height) => {
  const translateXY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0],
  })
  return { transform: [{ translateY: translateXY }] }
}

export const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps: SceneInterpolatorProps) => {
      const { layout, position, scene } = sceneProps
      const width = layout.initWidth
      const height = layout.initHeight
      const { index, route } = scene
      const params = route.params || {}
      const transition: ITransitions = params.transition || "default"
      return {
        default: SlideFromRight(index, position, width),
        bottomTransition: SlideFromBottom(index, position, height),
        topTransition: SlideFromTop(index, position, height),
      }[transition]
    },
  }
}

export function springyFadeIn() {
  const transitionSpec = {
    timing: Animated.spring,
    tension: 10,
    useNativeDriver: true,
  }

  return {
    transitionSpec,
    screenInterpolator: ({ position, scene }: SceneInterpolatorProps) => {
      const { index } = scene

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      })

      return { opacity }
    },
  }
}
