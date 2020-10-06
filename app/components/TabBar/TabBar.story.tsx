import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { TabBar, TabBarIconContainer } from "./TabBar"
import { SearchIcon } from "../icon/icon"

declare var module

storiesOf("TabBar", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Tab bar Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <TabBar />
      </UseCase>
      <UseCase
        style={{ backgroundColor: "rgba(60,64,198,0.6)" }}
        text="Tab-BarIcons"
        usage="How TabBar icon container should play"
      >
        <TabBarIconContainer tabName="Search" isActive>
          <SearchIcon />
        </TabBarIconContainer>
      </UseCase>
    </Story>
  ))

