import React, { useState, useEffect } from "react"
import { View, Modal, FlatList, TouchableOpacity } from "react-native"
import { FakeSelectInput, IFakeSelectInput } from "./FakeSelectInput"
import { usePrevious } from "../../hooks/usePrevious"
import { Controller, useFormContext } from "react-hook-form"
import { SearchBar } from "../SearchComponent"
import { EmptySearch } from "../animated/lottie"
import { LocationIcon } from "../icon/icon"
import { spacing } from "../../theme"
import { Text } from "../../components/text/text"

interface ISearchTextInput extends Omit<IFakeSelectInput, "children"> {
  handleQuery: (x: string) => void
  data: Array<any>
  renderListItem: (x: any) => Element
}

export const SearchTextInput = (props: ISearchTextInput) => {
  const {
    value,
    placeholder,
    label,
    errorMessage,
    renderItem,
    data,
    renderListItem,
    handleQuery,
    onChange,
  } = props

  const prevValue = usePrevious(value)

  return (
    <FakeSelectInput
      {...{
        value: value || "",
        placeholder,
        label,
        errorMessage,
        renderItem,
      }}
    >
      {(showModal, setShowModal) => {
        return (
          <Modal
            visible={showModal}
            onRequestClose={() => {
              setShowModal(false)
              onChange(prevValue)
            }}
            onDismiss={() => {
              setShowModal(false)
              onChange(prevValue)
            }}
          >
            <SearchView
              renderListItem={renderListItem}
              data={data}
              placeholder={label}
              handleQuery={handleQuery}
              onSelectValue={(data) => {
                setShowModal(false)
                onChange(data)
              }}
            />
          </Modal>
        )
      }}
    </FakeSelectInput>
  )
}

const SearchView = (props) => {
  const { data, renderListItem, label, handleQuery = () => {}, onSelectValue } = props
  const [query, setQuery] = useState("")

  useEffect(() => {
    handleQuery(query)
  }, [query])

  return (
    <View style={{ flex: 1 }}>
      <SearchBar placeholder={label} value={query} onChangeText={setQuery} />
      <FlatList
        data={data || []}
        renderItem={({ item }) => renderListItem({ item, onSelectValue })}
        ListEmptyComponent={() => <EmptySearch />}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  )
}

export const FormSearchView = (
  props: Omit<ISearchTextInput, "value" | "onSelectValue"> & {
    name: string
    defaultData?: string
  },
) => {
  const { name, defaultData, ...rest } = props
  const { control, errors } = useFormContext()
  return (
    <Controller
      as={<SearchTextInput {...rest} errorMessage={errors?.[name]?.message} />}
      defaultValue={defaultData}
      onChange={(args) => ({
        value: {
          id: args[0].id,
          value: args[0].value,
        },
      })}
      {...{ name, control }}
    />
  )
}

export const SearchPlaceItem = (props) => {
  return (
    <TouchableOpacity onPress={() => props.handleSelect({ id: props.id, value: props.name })}>
      <View
        pointerEvents="none"
        style={{ paddingVertical: `${spacing[1]}%`, flexDirection: "row" }}
      >
        <LocationIcon />
        <Text>{props.name}</Text>
      </View>
    </TouchableOpacity>
  )
}
