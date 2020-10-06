import React, { ComponentProps } from "react"
import { Controller, ControllerProps, useFormContext } from "react-hook-form"
import { TextInput } from "react-native-paper"
import TextInputMask from "react-native-text-input-mask"
import { color, spacing } from "../theme"
import { Text } from "./text/text"
import { View } from "react-native"

export interface FormInputProps extends
    Omit<ControllerProps<any>, "as"> {
  required?: boolean
  placeholder?: string
  value?: string
  label?: string
}

export const inputContainerStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0.4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 1.65,
  elevation: 2,
  backgroundColor: color.palette.white,
  borderWidth: 0.4,
  marginVertical: `${spacing[1]}%`,
}

export const FormInput = (props: FormInputProps & ComponentProps<typeof TextInput>) => {
  const {
    name,
    required = false,
    label,
    placeholder = label,
    defaultValue = "",
    value,
    onChange,
    ...rest
  } = props

  const { errors, control } = useFormContext()
  return (
    <Controller
      as={
        <StyledTextInput
          label={required ? `${label}*` : label}
          error={`${errors?.[name]?.message ?? ""}`.length > 0}
          placeholder={placeholder}
          style={inputContainerStyle}
          {...rest}
        />
      }
      name={name}
      onChangeName={props.mask ? "onChangeText" : "onChange"}
      onChange={
        onChange && typeof onChange === "function"
          ? onChange
          : (args) => (props.mask ? args[0] : args[0].nativeEvent.text)
      }
      {...{ defaultValue, control }}
    />
  )
}

export const StyledTextInput = (props) => {
  const { mask, ...rest } = props
  const extraProps = mask
    ? {
      render: (renderProps) => {
        return (
          <TextInputMask
            mask={mask}
            {...renderProps}
            value={renderProps.value?.value || renderProps.value}
          />
        )
      },
    }
    : {}
  return <TextInput {...rest} {...extraProps} />
}

export const FormTextArea = (props: FormInputProps & { limit?: number }) => {
  const { watch } = useFormContext()
  const value = watch(props.name) || ""
  const { limit = 500 } = props
  return (
    <View style={{ marginVertical: `${spacing[1]}%` }}>
      <FormInput
        multiline={true}
        numberOfLines={3}
        textAlignVertical="top"
        style={[inputContainerStyle, { marginVertical: 0, height: 150 }]}
        {...props}
      />
      <Text
        preset={["small", "muted"]}
        style={{ alignSelf: "flex-end", paddingHorizontal: `${spacing[0]}%` }}
      >
        {value.length}/{limit.toString()}
      </Text>
    </View>
  )
}
