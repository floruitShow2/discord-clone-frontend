import { EditorRange, INode, NodeType } from './index.interface'

/**
 * @description 判断当前节点是否有相邻节点
 * @param node
 * @returns
 */
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
    return text.startsWith('\u00A0') && btnNode?.tagName?.toLowerCase?.() === 'button'
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
// 创建@按钮
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
// 移除@按钮
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

// 创建一个换行符
export const createBrElement = () => {
  function createBrWrapper() {
    const el = document.createElement('div')
    const br = document.createElement('br')
    el.appendChild(br)
    return el
  }

  const rangeInfo = getEditorRange()
  if (!rangeInfo) return
  const { selection, range } = rangeInfo
  if (selection && selection.rangeCount) {
    const frag = document.createDocumentFragment()

    // 创建一个被 div 包裹的 br 标签【模拟默认换行行为】
    const el = createBrWrapper()
    let lastNode = el
    frag.appendChild(el)

    // 如果有选中文本，则在换行前先删除选中文本
    range.deleteContents()

    // 如果容器是元素节点，且没有子节点，则多插入一个 br
    const container = range.startContainer
    if (container.nodeName !== '#text' && container.childNodes.length === 0) {
      const extraBreak = createBrWrapper()
      lastNode = extraBreak
      frag.appendChild(extraBreak)
    }

    range.insertNode(frag)

    // 移动光标到最后一个换行节点
    range.setStartAfter(lastNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// 创建表情图片
export function createEmoji(data: Message.Emoji) {
  const emoji = document.createElement('img')
  emoji.dataset.info = JSON.stringify(data)
  emoji.setAttribute('src', data.url)
  emoji.setAttribute('style', 'display:inline-block;width:20px;height:20px;margin-right:2px;')
  emoji.contentEditable = 'false'
  emoji.tabIndex = 0

  return emoji
}

/**
 * @description NodeList => IMention[]
 */
export const transformNodeListToData = (
  nodeList: INode[]
): { pureString: string; mentionList: Message.Mention[]; emojiList: Message.Emoji[] } => {
  let pureString = ''
  const mentionList: Message.Mention[] = []
  const emojiList: Message.Emoji[] = []

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

    if (item.type === NodeType.EMOJI) {
      const { url } = item.data
      emojiList.push({
        url,
        offset: pureString.length
      })
      pureString += `<emoji src="${url}">`
    }
  })

  return { pureString, mentionList, emojiList }
}

/**
 * @description IMention[] => NodeList
 */
export const transformDataToNodeList = (
  pureString: string,
  mentionList: Message.Mention[],
  emojiList: Message.Emoji[]
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
  } else if (emojiList.length > 0) {
    emojiList.forEach((item) => {
      const { offset } = item
      const textPart = pureString.slice(cutStart, offset)
      if (textPart.length > 0) {
        nodeList.push({
          type: NodeType.TEXT,
          data: textPart
        })
      }

      nodeList.push({
        type: NodeType.EMOJI,
        data: item
      })
      const regex = /<emoji\s+src="(.*?)">/
      pureString = pureString.replace(regex, '')
      cutStart = offset || 0
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

  console.log(nodeList)
  return nodeList
}
