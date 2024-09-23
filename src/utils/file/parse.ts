export const readFileAsDataurl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = (e) => {
      const result = e.target?.result
      if (!result) {
        reject()
        return
      }
      resolve(result.toString())
    }
  })
}
