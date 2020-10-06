import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet, View, Image } from "react-native"
import { Screen, Text } from "../components"
// import { useStores } from "../models/root-store"
import { color, spacing } from "../theme"
import { NavigationScreenProp, FlatList } from "react-navigation"
import LottieView from "lottie-react-native"
import LinearGradient from "react-native-linear-gradient"

export interface ChatScreenProps {
  navigation: NavigationScreenProp<{}>
}

interface IMatches {
  name: string
  id: string
  imgUrl: string
}

const matchesData: IMatches[] = [
  {
    name: "Kaira",
    id: 20,
    imgUrl: "https://i.pinimg.com/originals/fb/53/fe/fb53fe5eb1f6b7c81bffc653c5149e88.jpg",
  },
  {
    name: "Anshika",
    id: 27,
    imgUrl: "https://i.pinimg.com/236x/b4/53/55/b453553626e6ec57ca7835ad9b71a24d.jpg",
  },
  {
    name: "Erza",
    id: 20,
    imgUrl: "https://i.pinimg.com/originals/e0/8a/07/e08a0787ab994363d58162b7e58e217d.jpg",
  },
  {
    name: "Akira",
    id: 27,
    imgUrl: "https://i.pinimg.com/564x/67/e5/d3/67e5d3d6893d5ea6950aff17a9b3c6ab.jpg",
  },
  {
    name: "Kaira",
    id: 20,
    imgUrl: "https://i.pinimg.com/originals/fb/53/fe/fb53fe5eb1f6b7c81bffc653c5149e88.jpg",
  },
  {
    name: "Anshika",
    id: 27,
    imgUrl: "https://i.pinimg.com/564x/c1/e1/50/c1e150a28e728df06b9c49b5e735b2ee.jpg",
  },
]

const _imageWidth = 100

export const ChatScreen: React.FunctionComponent<ChatScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  return (
    <View style={{ backgroundColor: color.palette.offWhite, flex: 1 }}>
      <Text preset={["header", "center"]}>Messages</Text>
      <NewMatches />
      <Messages />
    </View>
  )
})

const Messages = () => {
  return (
    <LinearGradient
      colors={["#ffffff",'#f0f0f0']}
      locations={[0, 0.7]}
      style={{
        paddingHorizontal: `${spacing[2]}%`,
        flex: 1,
        backgroundColor: "white",
        marginHorizontal: `${spacing[1]}%`,
        marginTop: `${spacing[1]}%`,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: `${spacing[1]}%`,
      }}
    >
      <Text preset={["primary"]}>Messages (0)</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <LottieView
            source={require("../../assets/lottie/no-message.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        }
      />
    </LinearGradient>
  )
}

const NewMatches = () => {
  return (
    <View style={{ paddingLeft: `${spacing[1]}%` }}>
      <Text preset="primary">New Matches</Text>
      <FlatList
        horizontal
        data={matchesData}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={{ margin: spacing[1] }}>
              <Image
                source={{ uri: item.imgUrl }}
                style={{ borderRadius: _imageWidth / 2, width: _imageWidth, height: _imageWidth }}
              />
              <Text preset={["small", "center"]}>{item.name}</Text>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
