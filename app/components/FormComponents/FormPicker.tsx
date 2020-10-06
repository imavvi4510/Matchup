import React from "react"
import { Modal, TouchableOpacity, View } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../text/text"
import { FakeSelectInput, IFakeSelectInput } from "./FakeSelectInput"
import { Controller, ControllerProps, useFormContext } from "react-hook-form"

interface ICommonPicker
  extends Omit<IFakeSelectInput, "children" | "placeholder" | "value" | "as"> {
  setAction?: Function
  list: string[] | { label: string; value: string | Record<any, any>; hidden?: boolean }[]
}

export const CommonPicker = (props: ICommonPicker) => {
  const { setAction, value, placeholder, label, list, errorMessage } = props
  return (
    <FakeSelectInput
      {...{
        value:
          typeof list[0] === "object"
            ? list.find((obj) => JSON.stringify(obj.value) === JSON.stringify(value))?.label || ""
            : value,
        placeholder,
        label,
        errorMessage,
      }}
    >
      {(showModal, setShowModal) => {
        const commonTask = () => {
          setShowModal(false)
        }

        return (
          <Modal
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
            onDismiss={() => {
              setShowModal(false)
            }}
            transparent={true}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowModal(false)}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.4)",
                padding: `${spacing[2]}%`,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: `${spacing[1]}%`,
                  borderRadius: 5,
                  borderWidth: 0.6,
                  borderColor: "#ccc",
                }}
              >
                {(list ?? []).map((e) =>
                  typeof e === "string" ? (
                    <React.Fragment key={e}>
                      <Text
                        style={{ padding: `${spacing[1]}%` }}
                        preset={["bold"]}
                        onPress={() => {
                          setAction(e)
                          commonTask()
                        }}
                      >
                        {e}
                      </Text>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={e.label}>
                      {!e.hidden && (
                        <Text
                          style={{ padding: `${spacing[1]}%` }}
                          preset={["bold"]}
                          onPress={() => {
                            setAction(e.value)
                            commonTask()
                          }}
                        >
                          {e.label}
                        </Text>
                      )}
                    </React.Fragment>
                  ),
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        )
      }}
    </FakeSelectInput>
  )
}

export const FormPicker = (props: ICommonPicker & Omit<ControllerProps<any>, "as">) => {
  const { name, ...rest } = props
  const { errors } = useFormContext()

  return (
    <Controller
      as={<CommonPicker {...rest} errorMessage={errors?.[name]?.message} />}
      onChangeName="setAction"
      onChange={(args) => ({
        value: args[0],
      })}
      {...{ name }}
    />
  )
}
