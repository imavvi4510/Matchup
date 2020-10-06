import React from "react"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { TextInput } from "react-native-paper"
import { spacing } from "../../theme"
import { inputContainerStyle } from "../formInput"
import { Text } from "../text/text"

export interface IFakeSelectInput {
  value: any
  placeholder: string
  label: string
  errorMessage?: string
  children: (showModal: boolean, setShowModal: Function) => void
  renderItem?: (x: any) => React.ReactElement
  onClear?: Function
}

const defaultRenderItem = ({ value, style }) => {
  return <Text style={style}>{value}</Text>
}

export const FakeSelectInput = (props: IFakeSelectInput) => {
  const {
    value,
    placeholder,
    label,
    errorMessage,
    children,
    renderItem = defaultRenderItem,
  } = props

  const [showModal, setShowModal] = React.useState(false)

  return (
    <TouchableWithoutFeedback
      style={{ marginVertical: `${spacing[1]}%` }}
      onPress={() => {
        setShowModal(true)
      }}
    >
      <TextInput
        {...{ value, label, errorMessage, placeholder }}
        style={[inputContainerStyle, { marginVertical: 0 }]}
        render={(renderProps) => {
          return renderProps.value ? (
            renderItem(renderProps)
          ) : (
            <Text preset="muted">{renderProps.placeholder}</Text>
          )
        }}
        error={props?.errorMessage?.length > 0}
      />
      {children(showModal, setShowModal)}
    </TouchableWithoutFeedback>
  )
}
