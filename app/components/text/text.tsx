import React from "react"
import { StyleSheet, Text as AppText } from "react-native"
import { handleLinkPress } from "../../utils/links"
import { presets as styles, TextPresets as IStyles } from "./text.presets"
import { TextProps } from "./text.props"

const getType = (type: IStyles) => (styles[type] ? styles[type] : {})
export const Text = (props: TextProps) => {
  const { children, style, preset = [] } = props

  const textStyles = [
    StyleSheet.flatten([
      styles.text,
      typeof preset === "string" ? getType(preset) : preset.map(e => getType(e)),
      style,
    ]),
  ]
  return (
    <AppText
      {...props}
      style={textStyles}
      onPress={e => {
        if (props.onPress) {
          props.onPress(e)
        } else {
          if (props.url) {
            handleLinkPress(props.url)
          }
        }
      }}
    >
      {children}
    </AppText>
  )
}
