import React from "react"
import { useStores } from "../models/root-store"
import { observer } from "mobx-react-lite"
import Modal from "react-native-modal"
import { StyleSheet, View } from "react-native"
import { Text } from "../components"
import { Button } from "react-native-paper"
import { handleLinkPress } from "../utils/links"
const templateConfig = require("../templateConfigs.json")

const getPropsFromTemplate = (queryKey) => templateConfig[queryKey]

export const ActionProvider = observer(() => {
  const { actionStore, navigationStore } = useStores()

  const activeAction = actionStore?.appActions?.[0] ?? {}

  const handleClose = () => {
    actionStore.hideAppActions()
  }

  const getButtonAction = (type, value, params) => () => {
    switch (type) {
      case "screen":
        navigationStore.navigateTo(value)
        break
      case "url":
        handleLinkPress(value)
        break
      case "action":
        value(params)
        break
    }

    handleClose()
  }

  const handleClick = getButtonAction(activeAction.type, activeAction.value, activeAction.params)

  return (
    <Modal
      isVisible={actionStore?.showAppActions || false}
      onSwipeComplete={handleClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      swipeDirection={["right", "left"]}
    >
      <DefaultModalContent
        {...getPropsFromTemplate(activeAction.templateId)}
        handleClick={handleClick}
      />
    </Modal>
  )
})

const DefaultModalContent = (props) => (
  <View style={styles.content}>
    <Text preset={["header", "center"]} style={styles.contentTitle}>
      {props.title}
    </Text>
    <Text preset={["large", "center"]}>{props.subtitle}</Text>
    <Text preset={["center", "small"]} style={{ marginBottom: 12 }}>
      {props.paragraph}
    </Text>
    <Button mode="contained" style={{ borderRadius: 12 }} onPress={props.handleClick}>
      {props.buttonText}
    </Button>
    <Text preset={["muted", "small"]} style={styles.swipeText}>
      Swipe left/right to dismiss
    </Text>
  </View>
)

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    alignItems: "center",
    borderRadius: 4,
    borderTopLeftRadius: 30,
    paddingTop: 28,
    borderTopRightRadius: 30,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    marginBottom: 12,
  },

  swipeText: {
    fontSize: 11,
    position: "absolute",
    right: 25,
    top: 5,
  },
})
