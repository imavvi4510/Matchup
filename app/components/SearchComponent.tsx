import React, { ComponentProps } from "react"
import { View } from "react-native"
import { TextInput, Searchbar as SearchbarComponent } from "react-native-paper"

export const SearchBar = (props: ComponentProps<typeof TextInput>) => {
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <SearchbarComponent {...props}/>
    </View>
  )
}

