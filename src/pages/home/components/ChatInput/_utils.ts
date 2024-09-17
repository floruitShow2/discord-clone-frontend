import { EditorRange, INode, NodeType } from './index.interface'

export const hasNextSibling = (node: any) => {
  if (node.nextElementSibling) {
    return true
  }
  while (node.nextSibling) {
    node = node.nextSibling
    if (node.length > 0) {
      return true
    }
  }
  return false
}

/**
 * @description 获取当前光标选取的信息
 * @returns
 */
export const getEditorRange = (): EditorRange | null => {
  let range = null
  let selection = null
  if (window.getSelection) {
    selection = window.getSelection()
    if (selection && selection.getRangeAt && selection.rangeCount) {
      range = selection.getRangeAt(0)
      return {
        range,
        selection
      }
    }
    return null
  }
  return null
}

/**
 * @description 获取光标坐标信息
 * @returns { x, y }
 */
export const getSelectionCoords = () => {
  let x = 0
  let y = 0
  let rect: DOMRect | undefined

  if (!window.getSelection) return { x, y }

  const selection = window.getSelection()
  if (selection && selection?.rangeCount) {
    // 初始化 selection 和 range
    const range = selection.getRangeAt(0).cloneRange()

    if (range.getClientRects) {
      range.collapse(true)
      const rects = range.getClientRects()
      rect = rects?.[0]
      if (!!rect) {
        const { left, top } = rects[0]
        x = left
        y = top
      }
    }

    // 创建一个不可见的 span 元素并插入文档，基于该元素计算坐标
    if ((x === 0 && y === 0) || !!rect) {
      const span = document.createElement('span')
      if (span.getClientRects) {
        span.appendChild(document.createTextNode('\u200b'))
        range.insertNode(span)
        rect = span.getClientRects()[0]
        x = rect.left
        y = rect.top
        const spanParent = span.parentNode!
        spanParent.removeChild(span)
        spanParent.normalize()
      }
    }
  }

  return { x, y }
}

export function isBeforeButtonWithSpace(container: any, offset: number) {
  // 检查光标前是否为按钮，光标后是否为空格
  if (container.nodeType === Node.TEXT_NODE) {
    // 按钮在文本中间
    const text = container.textContent
    const btnNode = container.parentNode.childNodes[offset]
    return text.startsWith('\u00A0') && btnNode?.tagName.toLowerCase() === 'button'
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    // 按钮在末尾
    const lastNode = container.childNodes[offset]
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE && !lastNode.textContent) {
      offset -= 1
    }
    // 如果是元素节点，检查其文本内容
    const textNode = container.childNodes[offset]
    const btnNode = container.childNodes[offset - 1]
    if (textNode && textNode.nodeType === Node.TEXT_NODE && btnNode) {
      const text = textNode.textContent
      return text.startsWith('\u00A0') && btnNode.tagName.toLowerCase() === 'button'
    }
  }
  return false
}
/**
 * @description 创建@按钮
 * @param mention
 * @returns
 */
export const createMentionBtn = (mention: Message.Mention) => {
  const btn = document.createElement('button')
  btn.dataset.info = JSON.stringify(mention)
  btn.textContent = `@${mention.username}`
  btn.setAttribute('class', 'text-blue-500')
  btn.contentEditable = 'false'
  btn.tabIndex = 0
  btn.addEventListener(
    'click',
    () => {
      return void 0
    },
    false
  )

  return btn
}

export function removeMentionBtn(container: any, offset: number) {
  if (container.nodeType === Node.TEXT_NODE) {
    const text = container.textContent
    const btnNode = container.parentNode.childNodes[offset]
    if (text.startsWith('\u00A0')) {
      container.deleteData(0, 1)
    }
    if (btnNode && btnNode.tagName.toLowerCase() === 'button') {
      container.removeChild(btnNode)
    }
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    // 如果是元素节点，删除元素及其后的空格
    // 如果是元素节点，检查其文本内容
    const textNode = container.childNodes[offset - 1]
    const btnNode = container.childNodes[offset - 2]
    if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent === '\u00A0') {
      container.removeChild(textNode)
    }
    if (btnNode && btnNode.tagName.toLowerCase() === 'button') {
      container.removeChild(btnNode)
    }
  }
}

/**
 * @description NodeList => IMention[]
 */
export const transformNodeListToMentionData = (
  nodeList: INode[]
): { pureString: string; mentionList: Message.Mention[] } => {
  let pureString = ''
  const mentionList: Message.Mention[] = []

  nodeList.forEach((item) => {
    if (item.type === NodeType.TEXT || item.type === NodeType.BR) {
      pureString += item.data
    }
    if (item.type === NodeType.MENTION) {
      const { userId, username, avatar } = item.data
      mentionList.push({
        userId,
        username,
        avatar,
        offset: pureString.length
      })
      pureString += '@' + username
    }
  })

  return { pureString, mentionList }
}

/**
 * @description IMention[] => NodeList
 */
export const transformMentionDataToNodeList = (
  pureString: string,
  mentionList: Message.Mention[]
): INode[] => {
  let cutStart: number = 0
  const nodeList: INode[] = []

  if (mentionList.length > 0) {
    mentionList.forEach((item) => {
      const { offset } = item
      // 截取 @符号 前面的文本
      const textPart = pureString.slice(cutStart, offset)
      if (textPart.length > 0) {
        nodeList.push({
          type: NodeType.TEXT,
          data: textPart
        })
      }

      nodeList.push({
        type: NodeType.MENTION,
        data: {
          userId: item.userId,
          username: item.username,
          avatar: item.avatar,
          offset: item.offset || 0
        }
      })

      cutStart = (offset || 0) + (item.username.length + 1)
    })

    const remainText = pureString.slice(cutStart)
    if (remainText.length) {
      nodeList.push({
        type: NodeType.TEXT,
        data: remainText
      })
    }
  } else {
    if (pureString.length > 0) {
      nodeList.push({
        type: NodeType.TEXT,
        data: pureString
      })
    }
  }

  return nodeList
}
