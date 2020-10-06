import * as React from "react"
import { View, TouchableOpacity, LayoutAnimation, TouchableWithoutFeedback } from "react-native"
import { Text } from "../"
import { spacing } from "../../theme"
import { forwardRef } from "react"

export const ExpandAnimation = () =>
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      200,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.scaleY,
    ),
  )

const ExpandebleInputComponent = (
  {
    title,
    value,
    children,
    onStateChange,
    isDisabled = false,
  }: {
    title: string
    value: string
    children?: React.ReactChild
    onStateChange?: Function
    isDisabled?: boolean
  },
  ref,
) => {
  const [isExpanded, setExpanded] = React.useState(false)
  const isFirstRender = React.useRef(true)

  React.useImperativeHandle(ref, () => ({
    setExpanded,
  }))

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      typeof onStateChange === "function" && onStateChange(isExpanded)
    }
  }, [isExpanded])

  return (
    <TouchableOpacity
      onPress={() => {
        ExpandAnimation()
        setExpanded(true)
      }}
      disabled={isDisabled}
    >
      <View
        pointerEvents="none"
        style={{ flexDirection: "row", padding: spacing[3], justifyContent: "space-between" }}
      >
        <Text>{title}</Text>
        <Text>{value}</Text>
      </View>
      {isExpanded && children ? (
        <TouchableWithoutFeedback touchSoundDisabled>{children}</TouchableWithoutFeedback>
      ) : null}
    </TouchableOpacity>
  )
}

export const ExpandebleInput = forwardRef(ExpandebleInputComponent)
