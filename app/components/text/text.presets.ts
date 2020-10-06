import { color, getFontStyleObject } from "../../theme"

export const presets = {
  /**
   * The default text styles.
   */
  text: {
    fontSize: 18,
    ...getFontStyleObject(),
  },

  bold: {
    ...getFontStyleObject({ weight: "Bold" }),
  },
  primary: {
    color: color.primary,
  },
  white: {
    color: color.palette.white,
  },
  dullWhite: {
    color: color.palette.offWhite,
  },
  small: {
    fontSize: 15,
  },
  xLarge: {
    fontSize: 30,
  },
  large: {
    fontSize: 22,
  },
  center: {
    textAlign: "center",
  },
  right: { textAlign: "right", alignSelf: "stretch" },
  muted: {
    color: color.palette.lightGrey,
  },
  paragraph: {
    color: color.palette.darkGrey,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
  },
  header: {
    fontSize: 35,
    ...getFontStyleObject({ weight: "Regular" }),
  },
  fontAnson: {
    ...getFontStyleObject({ weight: "Regular" }),
  },
  underline: {
    textDecorationLine: "underline",
  },
  link: {
    textDecorationLine: "underline",
    color: color.palette.link,
  },
  validationError: {
    color: color.palette.angry,
    fontSize: 15,
    marginTop: 5,
    padding: "1%",
  },

  quote: {
    fontStyle: "italic"
  }
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets
