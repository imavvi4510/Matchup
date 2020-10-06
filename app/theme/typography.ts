import { Platform } from "react-native"

interface IWeights {
  [key: string]:
    | "400"
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | undefined
}
const fonts = {
  "SourceSansPro": {
    weights: {
      Regular: "400",
      Bold: "900",
    } as IWeights,
  },
}

interface IParams {
  family?: "SourceSansPro"
  weight?: "Regular" | "Bold"
}

export const getFontStyleObject = (params: IParams = {}) => {
  const { family = "SourceSansPro", weight = "Regular" } = params

  const { weights } = fonts[family]

  if (Platform.OS === "android") {
    const suffix = weights[weight] ? weight : ""
    return { fontFamily: family + (suffix.length ? `-${suffix}` : "") }
  }

  return {
    fontFamily: family,
    fontWeight: weights[weight] || weights.Regular,
  }
}
