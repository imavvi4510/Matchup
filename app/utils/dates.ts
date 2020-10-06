export const isValidDate = (d: any) => {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    // it is a date
    if (isNaN(d.getTime())) {
      // d.valueOf() could also work
      // date is not valid
      return false
    } else {
      // date is valid
      return true
    }
  } else {
    // not a date
    return false
  }
}
