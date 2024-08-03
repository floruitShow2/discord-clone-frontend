import { isClipboardSupported } from '@/utils/is'

export async function copyText(options: {
  text: string
  onSuccess?: () => void
  onError?: () => void
}) {
  const { text, onSuccess, onError } = options

  try {
    const res = await isClipboardSupported()
    if (res.writePermission && res.writeWorks) {
      navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = '0'
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.style.opacity = '0'
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    onSuccess && onSuccess()
  } catch {
    onError && onError()
  }
}
