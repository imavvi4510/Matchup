// @flow
import React from "react"
import { View } from "react-native"
import { NavigationInjectedProps } from "react-navigation"
import Stories2 from "./components/Stories2"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/root-store"

export interface WelcomeScreenProps extends NavigationInjectedProps<{}> {}

export const WelcomeScreen = observer(() => {
  const { peopleStore } = useStores()

  return (
    <View style={{ flex: 1 }}>
      <Stories2 {...{ stories: peopleStore.peoplelist }} />
    </View>
  )
})
