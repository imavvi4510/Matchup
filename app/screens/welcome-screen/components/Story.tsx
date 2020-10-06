// @flow

import * as React from "react"
import { Animated, Dimensions, Image, ImageBackground, StyleSheet, View } from "react-native"
import FastImage from "react-native-fast-image"
import { PanGestureHandler, TouchableOpacity } from "react-native-gesture-handler"
import AntIcons from "react-native-vector-icons/AntDesign"
import { SharedElement } from "react-navigation-shared-element"
import { Text } from "../../../components"
import { useStores } from "../../../models/root-store"
import { spacing } from "../../../theme"
import { IUserStory } from "../../types"
import { getProfilePic } from "../../../utils/links"
import { getShortParagaph } from "../../../utils/errorMessages"

const { width } = Dimensions.get("window")
export interface StoryProps {
  story: IUserStory
}

const imgUrl = "https://i.pinimg.com/564x/c1/e1/50/c1e150a28e728df06b9c49b5e735b2ee.jpg"
const imageWidth = width * 0.8
const scrollOffset = -150

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: `${spacing[1]}%`,
    paddingBottom: spacing[1],
  },
  details: {
    flex: 1,
    alignItems: "center",
  },
  heroContainer: {
    borderWidth: spacing[2],
    borderColor: "#FFF",
    width: imageWidth,
    height: imageWidth,
    borderRadius: imageWidth / 2,
  },
  heroImageContainer: {
    alignItems: "center",
    elevation: 4,
    flex: 2,
    justifyContent: "center",
  },
  iconRowContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
})

const Story: React.FunctionComponent<StoryProps> = (props) => {
  const { navigationStore, personStore } = useStores()

  const transY = new Animated.Value(0)
  const animatedOpacity = transY.interpolate({
    inputRange: [-200, 0],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const { name, height, weight, profession, age, id, native, expectations } = props.story

  const handleGesture = Animated.event([{ nativeEvent: { translationY: transY } }])

  return (
    <ImageBackground
      source={{ uri: getProfilePic(props.story.profilepic) }}
      style={{ width: "100%", height: "100%" }}
      blurRadius={1.2}
    >
      <View style={styles.container}>
        <View style={styles.heroImageContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: transY.interpolate({
                    inputRange: [-400, 0],
                    outputRange: [1.5, 1],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: transY.interpolate({
                    inputRange: [-400, 0, 400],
                    outputRange: [100, 0, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <SharedElement id={id}>
              <Image
                style={styles.heroContainer}
                source={{ uri: getProfilePic(props.story.profilepic) }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </SharedElement>
          </Animated.View>

          <Animated.View
            style={{
              ...styles.iconRowContainer,
              opacity: animatedOpacity,
              transform: [
                {
                  translateY: transY.interpolate({
                    inputRange: [-400, 0, 400],
                    outputRange: [100, 0, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Text preset={["quote", "large", "white"]}>
              <Text preset={["header"]}>“</Text>
              {getShortParagaph(expectations)}
            </Text>
          </Animated.View>
        </View>
        <PanGestureHandler
          onGestureEvent={handleGesture}
          onHandlerStateChange={(e) => {
            const hasEnded = e.nativeEvent.state === 5
            if (hasEnded) {
              if (e.nativeEvent.translationY < scrollOffset) {
                transY.setValue(0)
                personStore.updateProfile(props.story)
                navigationStore.navigateTo("demo")
                return null
              }
              transY.setValue(0)
            }
          }}
        >
          <Animated.View style={[styles.details, { opacity: animatedOpacity }]}>
            <Text preset={["header", "white", "center"]}>
              {name} <Text>{age}</Text>
            </Text>
            <Text preset={["dullWhite", "center"]}>
              {weight} kg, {`${height.split(".")[0]}`}"{`${height.split(".")?.[1] ?? 0}`}'
            </Text>
            <Text preset={["dullWhite", "center"]}>{profession} </Text>
            <Text preset={["dullWhite", "center"]}>lives @ {native} </Text>

            <View style={{ marginTop: `${spacing[2]}%`, alignItems: "center" }}>
              <AntIcons name="up" size={15} color={"white"} />
              <Text preset={["white", "small"]}>Swipe up to know more</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </ImageBackground>
  )
}

export default Story
