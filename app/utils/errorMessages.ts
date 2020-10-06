import get from "lodash/get"
export const errorMessage = (e: any) => {
  try {
    if (e.response && e.response.data) {
      return e.response.data.message || e.message
    }
    return e.message
  } catch {
    return e
  }
}

export const getShortParagaph = (paragraph: string, numChar = 80) => {
  const shortString = paragraph.substr(0, numChar - 3)
  if (shortString === paragraph) return paragraph
  else return `${shortString}...`
}
