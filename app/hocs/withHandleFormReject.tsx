import React from "react"
import { useFormContext } from "react-hook-form"

export const withHandleFormReject = (WrappedComponent: any) => {
  return (props: any) => {
    const {
      formState: { submitCount,isValid },
      errors,
    } = useFormContext()

    React.useEffect(() => {
      if (submitCount > 0 && !isValid && Object.keys(errors || {}).length > 0) {
        typeof props.handleFormReject === "function"
          ? props.handleFormReject("Please fill form details before submitting.")
          : console.error('define a prop as "handleFormReject"')
      }
      __DEV__ && console.log("the current form failed=", errors)
    }, [errors, isValid, submitCount])
    return <WrappedComponent {...props} />
  }
}
