import { sakiMessage } from '@/utils'

export const messageSuccess = (message: string) => {
  sakiMessage({
    type: 'success',
    offset: 66,
    message
  })
}
export const messageError = (message: string) => {
  sakiMessage({
    type: 'error',
    offset: 66,
    message
  })
}
