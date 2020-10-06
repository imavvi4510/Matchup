import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { EmptyPreference } from "./EmptyPreference"

declare var module

storiesOf("EmptyPreference", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <EmptyPreference text="EmptyPreference" />
      </UseCase>
    </Story>
  ))
