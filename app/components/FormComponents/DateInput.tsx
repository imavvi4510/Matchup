import React from "react"
import { FakeSelectInput, IFakeSelectInput } from "./FakeSelectInput"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import { usePrevious } from "../../hooks/usePrevious"
import { isValidDate } from "../../utils/dates"
import Config from "../../Config"
import { Controller, useFormContext } from "react-hook-form"

interface IDatePickerInput extends Omit<IFakeSelectInput, "children"> {
  mode?: string
  display?: string
  onSelectValue: (event: any, value?: Date) => void
  onTouchCancel?: Function
  maximumDate?: Date | undefined
  minimumDate?: Date | undefined
}

export const DateInput = (props: IDatePickerInput) => {
  const {
    value,
    placeholder,
    label,
    mode = "date",
    display = "default",
    onSelectValue,
    onTouchCancel,
    errorMessage,
    maximumDate,
    minimumDate,
    renderItem,
  } = props

  const [selectedDate, setSelectedDate] = React.useState(new Date())

  const prevValue = usePrevious(value)
  React.useEffect(() => {
    if (value) {
      const newvalue = isValidDate(value)
        ? value
        : typeof value === "string"
          ? moment(value, Config.dateFormatString).toDate()
          : null
      isValidDate(newvalue) && setSelectedDate(newvalue)
    }
  }, [value])

  return (
    <FakeSelectInput
      {...{
        value: isValidDate(value)
          ? moment(new Date(value)).format(Config.dateFormatString)
          : value || "",
        placeholder,
        label,
        errorMessage,
        renderItem,
      }}
    >
      {(showModal, setShowModal) => {
        return (
          showModal && (
            <DateTimePicker
              value={selectedDate}
              onChange={(event, selectedValue) => {
                setShowModal(false)
                onSelectValue(selectedValue)
              }}
              onTouchCancel={() => {
                setShowModal(false)
                onSelectValue(prevValue)
                typeof onTouchCancel === "function" && onTouchCancel()
              }}
              {...{ mode, display, maximumDate, minimumDate }}
            />
          )
        )
      }}
    </FakeSelectInput>
  )
}

export const FormDatePicker = (
  props: Omit<IDatePickerInput, "value" | "onSelectValue"> & {
    name: string
    defaultData?: string
  },
) => {
  const { name, defaultData, rules, ...rest } = props
  const { control, triggerValidation, errors } = useFormContext()
  return (
    <Controller
      as={
        <DateInput
          onTouchCancel={() => triggerValidation(name)}
          {...rest}
          errorMessage={errors?.[name]?.message}
        />
      }
      defaultValue={defaultData}
      onChangeName="onSelectValue"
      onChange={(args) => ({
        value: args[0] ? moment(new Date(args[0])).format(Config.dateFormatString) : null,
      })}
      {...{ name, control }}
    />
  )
}
