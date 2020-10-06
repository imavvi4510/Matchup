import * as React from "react"
import { Image, View, RefreshControl, FlatList, TouchableOpacity, Dimensions } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { Text, HeartIcon, HeartIconOutlined } from "../components"
import { useStores } from "../models/root-store"
import { spacing } from "../theme"
import { useFetch } from "use-fetch-lib"
import { getProfilePic } from "../utils/links"
import { IUserStory } from "./types"
import { observer } from "mobx-react-lite"
import { HeartLottie } from "../components/animated/lottie"
import { PAYMENT_LINK } from "../constants"

const { width } = Dimensions.get("screen")
const introCardWidth = width / 2 - width * 0.03

export interface LandingScreenProps {
  navigation: NavigationScreenProp<{}>
}

interface IntroProps {
  id: string
  name: string
  age: number
  profilepic: string
  isSaved?: boolean
  profession?: string
  isLiked?: boolean
}

export const LandingScreen: React.FunctionComponent<LandingScreenProps> = observer(() => {
  const { navigationStore, peopleStore, actionStore, preferenceStore } = useStores()

  const [{ data, status }, service] = useFetch<{ profilelist: IntroProps[] }>({
    url: "/get/profilelist",
    method: "get",
    shouldDispatch: true,
  })

  React.useEffect(() => {
    if (preferenceStore.actionComplete) {
      service()
      preferenceStore.set("actionComplete", false)
    }
  }, [preferenceStore.actionComplete])

  const [{ data: people, status: peopleLoadingStatus }, fetchPeople] = useFetch<{
    peoplelist: IUserStory[]
  }>({
    url: "/get/people",
    method: "post",
  })

  const [refreshing, setRefreshing] = React.useState(false)

  React.useEffect(() => {
    if (!status.isPending) {
      if (refreshing) setRefreshing(false)
    }
  }, [status])

  React.useEffect(() => {
    if (peopleLoadingStatus.isFulfilled) {
      peopleStore.setPeoples(people.peoplelist)
      navigationStore.navigateTo("profile")
    }
  }, [peopleLoadingStatus])

  return (
    <View style={{ flex: 1, padding: 3, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              width: "100%",
              paddingHorizontal: `${spacing[3]}%`,
              paddingBottom: `${spacing[2]}%`,
            }}
          >
            <Text preset={["header", "center"]}>Explore</Text>
            <Text preset={["center"]}>
              look through all the profile in your area and connect with them to see if it works
              out.
            </Text>
          </View>
        }
        data={data?.profilelist || []}
        numColumns={2}
        extraData={actionStore.userActions}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: spacing[5] }}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => {
          actionStore.addAppActions({
            id: `${Math.random() * 100}`,
            type: "url",
            value: PAYMENT_LINK,
            templateId: "restricted",
          })
        }}
        renderItem={({ item, index }) => {
          const isLiked = actionStore?.userActions?.[item.id] === "like"
          return (
            <IntroCard
              {...item}
              isLiked={isLiked}
              onPress={() => {
                fetchPeople({ id: item.id })
              }}
              onLikePress={(doesLike) => {
                if (doesLike) {
                  actionStore.addUserActions({ [item.id]: "like" })
                } else {
                  actionStore.deleteUserAction(item.id)
                }
              }}
            />
          )
        }}
        ListEmptyComponent={
          <Text preset={["header", "center"]}>
            {status.isPending ? "Fetching" : "No profile found. Pull to refresh"}
          </Text>
        }
        keyExtractor={(item, index) => `${index}-${item.name}`}
        ListFooterComponent={
          data?.profilelist?.length ? (
            <Text preset={["center", "muted"]}>That's all folks.</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              service()
            }}
          />
        }
      />
    </View>
  )
})

const IntroCard = (
  props: IntroProps & { onPress: (e: any) => void; onLikePress: (e: any) => void },
) => {
  const [{ data, status }, setLike] = useFetch<ActionsResponse, ActionRequest>({
    url: "/set/actions",
    method: "post",
  })

  const { likedPeople } = useStores()

  React.useEffect(() => {
    if (status.isFulfilled && data) {
      props.onLikePress(data.status)
      props.isLiked
        ? likedPeople.deletePerson(props.id)
        : likedPeople.setPerson(likedPeople.peoplelist.length, props)
    }
  }, [status])

  return (
    <View style={{ width: introCardWidth, margin: "1%" }}>
      <TouchableOpacity style={{ width: "100%" }} onPress={props.onPress}>
        <Image
          source={{ uri: getProfilePic(props.profilepic) }}
          style={{ width: "100%", height: 300, borderRadius: 12 }}
        />
        {status.isPending && !props.isLiked && <HeartLottie />}
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
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
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
          <TouchableOpacity
            style={{ paddingHorizontal: spacing[0] }}
            onPress={() =>
              setLike({ action: "like", id: props.id, type: props.isLiked ? "delete" : "insert" })
            }
          >
            {props.isLiked ? <HeartIcon size={25} /> : <HeartIconOutlined size={25} />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )
}
