import * as React from "react"
import { observer } from "mobx-react-lite"
import {
  ViewStyle,
  RefreshControl,
  ScrollView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { Screen, Text, HeartIcon, HeartIconOutlined } from "../components"
// import { useStores } from "../models/root-store"
import { color, spacing } from "../theme"
import { NavigationScreenProp } from "react-navigation"
import LinearGradient from "react-native-linear-gradient"
import { getProfilePic } from "../utils/links"
import { useFetch } from "use-fetch-lib"
import { useStores } from "../models/root-store"
export interface PeopleScreenProps {
  navigation: NavigationScreenProp<{}>
}

const ROOT: ViewStyle = {
  backgroundColor: "#f9f9f9",
  flexGrow: 1,
}

export const PeopleScreen: React.FunctionComponent<PeopleScreenProps> = observer((props) => {
  const { likedPeople, peopleStore, navigationStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)

  const [{ data: peopleLiked, status: peopleLikedStatus }] = useFetch({
    url: "/get/people/liked",
    method: "get",
    dependencies: [],
  })

  React.useEffect(() => {
    if (peopleLikedStatus.isFulfilled) {
      likedPeople.setPeoples(peopleLiked.peopleList)
    }
  }, [peopleLikedStatus])

  const [{ data: peopleIntrested, status: peopleIntrestedStatus }, fetchInterested] = useFetch({
    url: "/get/people/interested",
    method: "get",
    dependencies: [],
  })

  React.useEffect(() => {
    if (peopleIntrestedStatus.isFulfilled) {
      setRefreshing(false)
    }
  }, [peopleIntrestedStatus])

  const [{ data: people, status: peopleLoadingStatus }, fetchPeople] = useFetch({
    url: "/get/people",
    method: "post",
  })

  React.useEffect(() => {
    if (peopleLoadingStatus.isFulfilled) {
      peopleStore.setPeoples(people.peoplelist)
      navigationStore.navigateTo("profile")
    }
  }, [peopleLoadingStatus])

  return (
    <ScrollView
      contentContainerStyle={ROOT}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
        setRefreshing(true)
        fetchInterested()
      }} />}
    >
      <Text preset={["header", "center"]}>Connects</Text>
      <Text style={{ marginBottom: spacing[3] }} preset={["center", "muted"]}>
        View all of your connection in one place
      </Text>
      <NewMatches
        matchesData={peopleIntrested?.peopleList || []}
        handlePress={(id) => fetchPeople({ id })}
      />
      <LinearGradient
        colors={["#ffffff", "#f0f0f0"]}
        locations={[0, 0.7]}
        style={{
          paddingHorizontal: `${spacing[1]}%`,
          flex: 1,
          backgroundColor: "white",
          marginHorizontal: `${spacing[1]}%`,
          marginTop: `${spacing[1]}%`,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingTop: `${spacing[1]}%`,
        }}
      >
        <Text preset={["primary"]}>People you like ({likedPeople.peoplelist?.length ?? 0})</Text>
        <FlatList
          data={likedPeople.peoplelist}
          numColumns={2}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item }) => (
            <IntroCard {...item} onPeoplePress={(id) => fetchPeople({ id })} />
          )}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text preset={["center", "large", "primary"]}>Like people to view them here.</Text>
            </View>
          )}
        />
      </LinearGradient>
    </ScrollView>
  )
})

const _imageWidth = 100

const NewMatches = ({ matchesData, handlePress }) => {
  return (
    <View style={{ marginHorizontal: `${spacing[1]}%` }}>
      <Text preset="primary">New Matches</Text>
      <FlatList
        horizontal
        data={matchesData || []}
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ width: "100%", marginTop: spacing[4] }}>
            <Text preset={["large", "center"]}>New Matches will appear here</Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => handlePress(item.id)}>
              <View style={{ margin: spacing[1] }}>
                <Image
                  source={{ uri: getProfilePic(item.profilepic) }}
                  style={{ borderRadius: _imageWidth / 2, width: _imageWidth, height: _imageWidth }}
                />
                <Text preset={["small", "center"]}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

interface IntroProps {
  id: string
  name: string
  age: number
  profilepic: string
  isSaved?: boolean
  profession?: string
  isLiked?: boolean
  onPeoplePress: (id: string) => void
}
const { width } = Dimensions.get("screen")
const introCardWidth = width / 2 - width * 0.09

const IntroCard = (
  props: IntroProps & { onPress: (e: any) => void; onLikePress: (e: any) => void },
) => {
  return (
    <View style={{ width: introCardWidth, margin: "1%" }}>
      <TouchableOpacity style={{ width: "100%" }} onPress={() => props.onPeoplePress(props.id)}>
        <Image
          source={{ uri: getProfilePic(props.profilepic) }}
          style={{ width: "100%", height: 250, borderRadius: 12 }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            paddingBottom: spacing[1],
            width: "98%",
            paddingLeft: spacing[2],
            backgroundColor: "rgba(0,0,0,0.3)",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text preset={["white", "small"]}>
              <Text>{props.name.split(" ")[0]}</Text>, &nbsp;<Text>{props.age}</Text>
            </Text>
            <Text
              style={{
                color: "#FFD700",
                textTransform: "capitalize",
              }}
              preset={["bold", "small"]}
            >
              {props.profession}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
