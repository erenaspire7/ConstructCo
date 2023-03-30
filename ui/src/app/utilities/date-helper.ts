const convertToInputDate = (date: string) => {
  let dateObj = new Date(date).toLocaleDateString('en-US')

  let dateFormat: any = dateObj.split('/')
  dateFormat = dateFormat[2] + '-' + fixDateFormat(dateFormat[0]) + '-' + fixDateFormat(dateFormat[1])

  return dateFormat
}

const fixDateFormat = (val: string) => {
  let num = parseInt(val)

  return num < 10 ? `0${num}` : num.toString()
}


export { convertToInputDate }
