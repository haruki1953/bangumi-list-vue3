export const messageSuccess = (message: string) => {
  ElMessage({
    type: 'success',
    offset: 66,
    message
  })
}
export const messageError = (message: string) => {
  ElMessage({
    type: 'error',
    offset: 66,
    message
  })
}
