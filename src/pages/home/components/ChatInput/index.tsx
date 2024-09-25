import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import type { ForwardedRef } from 'react'
import { cs } from '@/utils/property'
import {
  createEmoji,
  createBrElement,
  createMentionBtn,
  getEditorRange,
  getSelectionCoords,
  transformDataToNodeList,
  transformNodeListToData,
  isBeforeButtonWithSpace,
  removeMentionBtn
} from './_utils'
import { ChatInputMethod, ChatInputProps, EditorRange, INode, NodeType } from './index.interface'

const ChatInput = forwardRef((props: ChatInputProps, ref: ForwardedRef<ChatInputMethod>) => {
  const {
    className,
    value = '',
    mentions = [],
    emojis = [],
    placeholder = '请输入',
    disabled = false,
    loadMembers,
    onInputChange,
    onFocus,
    onBlur,
    onConfirm
  } = props

  const [isInitialized, setIsInitialized] = useState(false)
  const init = () => {
    const editor = editorRef.current
    if (!editor) return
    const nodeList = transformDataToNodeList(value, mentions, emojis)
    nodeList.forEach((node) => {
      if (node.type === NodeType.MENTION) {
        const btn = createMentionBtn(node.data)
        editor.appendChild(btn)
      } else if (node.type === NodeType.EMOJI) {
        const emoji = createEmoji(node.data)
        editor.appendChild(emoji)
      } else {
        const textNode = document.createTextNode(node.data)
        editor.appendChild(textNode)
      }
    })

    setIsInitialized(true)
  }
  useEffect(() => {
    // 首次加载，执行初始化操作
    if (value && value.length && !isInitialized) {
      init()
    }

    // 首次加载 value 为空时，单独处理下
    if (!(value && value.length > 0) && !isInitialized) {
      setTimeout(() => {
        init()
      }, 500)
    }

    // 清空输入
    if (!value && isInitialized && editorRef.current) {
      while (editorRef.current?.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild)
      }
    }

    setInputValue(value)
  }, [value, mentions, emojis])

  const editorRef = useRef<HTMLDivElement>(null)
  const editorRange = useRef<EditorRange | null>(null)

  // 查询参数
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState(value)
  /**
   * @description 输入框数据变化时，更新 mentionList
   * @description 用户输入、选择@用户 时，会触发该事件
   * @returns
   */
  const onInputDataChange = () => {
    if (!editorRef.current) return

    const nodeList: INode[] = []
    const editorChildNodes: any[] = [].slice.call(editorRef.current.childNodes)
    if (editorChildNodes.length) {
      editorChildNodes.forEach((element) => {
        // 文本
        if (element.nodeName === '#text') {
          const el = element as Text
          if (el.data && el.data.length > 0) {
            nodeList.push({
              type: NodeType.TEXT,
              data: element.data
            })
          }
        }
        // br换行
        if (element.nodeName === 'BR') {
          nodeList.push({
            type: NodeType.BR,
            data: '\n'
          })
        }
        // button
        if (element.nodeName === 'BUTTON') {
          const personInfo = JSON.parse(element.dataset.info || '')
          nodeList.push({
            type: NodeType.MENTION,
            data: personInfo
          })
        }
        // emoji 表情
        if (element.nodeName === 'IMG') {
          const emojiInfo = JSON.parse(element.dataset.info || '')
          nodeList.push({
            type: NodeType.EMOJI,
            data: emojiInfo
          })
        }
      })
    }

    const { pureString, mentionList, emojiList } = transformNodeListToData(nodeList)
    if (pureString.length > 0 && pureString.charAt(pureString.length - 1) === '\n') {
      onInputChange &&
        onInputChange(pureString.substring(0, pureString.length - 1), mentionList, emojiList)
    } else {
      onInputChange && onInputChange(pureString, mentionList, emojiList)
    }
  }

  // 弹出层
  const popoverWidth = 250
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (popoverVisible) {
      const { x: cursorX, y: cursorY } = getSelectionCoords()
      if (editorRef.current) {
        const { right: editorRight } = editorRef.current.getBoundingClientRect()
        if (cursorX + popoverWidth > editorRight) {
          setPopoverPosition({ x: editorRight - popoverWidth, y: cursorY })
        } else {
          setPopoverPosition({ x: cursorX, y: cursorY })
        }
      } else {
        setPopoverPosition({ x: cursorX, y: cursorY })
      }
    }
  }, [popoverVisible])

  // @成员
  const POPOVER_ELEMENT_ID = 'at-mentions-popover'
  const [activeIndex, setActiveIndex] = useState(0)
  const [members, setMembers] = useState<Message.Mention[]>([])
  const insertHtmlAtCaret = (btn: HTMLButtonElement, bSpaceNode: Text) => {
    if (!editorRange.current) return
    let { selection, range } = editorRange.current
    if (selection.rangeCount) {
      if (selection.focusNode?.parentNode?.nodeName === 'BUTTON') return
      range.deleteContents()

      const el = document.createElement('div')
      el.appendChild(btn)
      if (bSpaceNode) el.appendChild(bSpaceNode)

      const frag = document.createDocumentFragment()
      let node
      let lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }

      range.insertNode(frag)
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }
  const insertEmoji = (emoji: HTMLImageElement) => {
    if (!editorRef.current) return
    const rangeInfo = getEditorRange()
    if (!rangeInfo) return
    let { selection, range } = rangeInfo
    if (selection.rangeCount) {
      if (cachedPosition.current) {
        range.setStart(cachedPosition.current.startContainer, cachedPosition.current.startOffset)
        range.setEnd(cachedPosition.current.endContainer, cachedPosition.current.endOffset)
      } else {
        range.selectNodeContents(editorRef.current)
        range.collapse(false) // 移动光标到末尾
      }

      range.insertNode(emoji)

      range = range.cloneRange()
      range.setStartAfter(emoji)
      // range.setEndAfter(frag);
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    onInputDataChange()
  }
  const onSelectMember = (member: Message.Mention) => {
    closeMembersPopover()
    const editor = editorRef.current
    if (!editor) return

    const currentRange = editorRange.current?.range
    if (!currentRange) return

    // 获取末尾文本节点
    const textNode = currentRange.endContainer
    // 获取光标位置
    const endOffset = currentRange.endOffset
    // 获取光标前的@符号位置
    const textNodeValue = textNode.nodeValue
    const expRes = /@([^@]*)$/.exec(textNodeValue || '')
    if (expRes && expRes.length > 1) {
      // 删除@符号到光标位置的文本
      currentRange.setStart(textNode, expRes.index)
      currentRange.setEnd(textNode, endOffset)
      currentRange.deleteContents()
      // 创建一个按钮节点，上面会有成员的基本信息
      const btn = createMentionBtn(member)
      // 创建一个空格字符
      const bSpaceNode = document.createTextNode('\u00A0')
      insertHtmlAtCaret(btn, bSpaceNode)
    }

    onInputDataChange()
  }

  // 依赖 searchQuery 的变化，更新成员列表
  useEffect(() => {
    loadMembers &&
      loadMembers(searchQuery).then((res) => {
        setMembers(
          res.map((item) => ({
            username: item.username,
            userId: item.userId,
            avatar: item.avatar,
            offset: 0
          }))
        )
      })
  }, [searchQuery])

  const closeMembersPopover = () => {
    setPopoverVisible(false)
    setPopoverPosition({ x: 0, y: 0 })
    setSearchQuery('')
    setMembers([])
  }
  /**
   * @description 判断是否需要展示 @用户 弹窗列表
   */
  const checkIsShowSelectPopover = () => {
    const rangeInfo = getEditorRange()
    if (!rangeInfo || !rangeInfo.range || !rangeInfo.selection) {
      setPopoverVisible(false)
      return
    }

    const curNode = rangeInfo.range.endContainer
    if (!curNode || !curNode.textContent || curNode.nodeName !== '#text') {
      setPopoverVisible(false)
      return
    }

    const contentStr = curNode.textContent.slice(0, rangeInfo.selection.focusOffset)
    // 判断光标位置前方是否有 @ ，只有一个 @ 则展示默认dialog，除了 @ 还有关键字则展示searchDialog
    const keywords = /@([^@]*)$/.exec(contentStr)
    if (keywords && keywords.length >= 2) {
      const [, keyWord] = keywords
      // 关键字超过 20 个字符，跳过 @成员 逻辑
      if (keyWord && keyWord.length > 20) {
        closeMembersPopover()
        return
      }

      setPopoverVisible(true)
      setSearchQuery(keyWord)

      editorRange.current = rangeInfo
    } else {
      closeMembersPopover()
    }
  }

  const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.code === 'Digit2') {
      // 输入 @ 时，直接展示弹出层
      setPopoverVisible(true)
    } else {
      // 没输入 @，但是之前可能输入了 @，判断下
      checkIsShowSelectPopover()
    }
  }

  const lastKeyPressTime = useRef(0)
  const [isComposing, setIsComposing] = useState(false)
  const onInputCompositionStart = () => {
    setIsComposing(true)
  }
  const onInputCompositionEnd = () => {
    setIsComposing(false)
  }
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log('key down', e)

    // 拦截 backsapce 删除
    if (e.code === 'Backspace') {
      const rangeInfo = getEditorRange()
      if (!rangeInfo) return

      const { selection, range } = rangeInfo
      if (selection && selection.rangeCount) {
        const container = range.startContainer
        const offset = range.startOffset

        if (isBeforeButtonWithSpace(container, offset)) {
          removeMentionBtn(container, offset)
          e.preventDefault()
        }

        // 如果光标在文本节点的最后一个字符，且文本节点的父节点是 div，则删除 div
        // if (container.nodeName === '#text' && offset === container.textContent?.length && container.parentNode)
      }
    }

    // 拦截 arrowDown | arrowUp 上移、下移
    if (popoverVisible && members.length > 0) {
      const itemHeight = 50
      const popoverMaxHeight = 300
      if (e.code === 'ArrowDown') {
        e.preventDefault()
        let newIndex = activeIndex + 1
        if (newIndex === members.length) {
          newIndex = 0
        }
        setActiveIndex(newIndex)
        const nowScrollTop = document.getElementById(POPOVER_ELEMENT_ID)!.scrollTop
        // 调整滚动条的位置
        if ((newIndex + 1) * itemHeight > popoverMaxHeight + nowScrollTop) {
          document.getElementById(POPOVER_ELEMENT_ID)!.scrollTop =
            (newIndex + 1) * itemHeight - popoverMaxHeight
        }
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        let newIndex = activeIndex - 1
        if (newIndex < 0) {
          newIndex = members.length - 1
        }
        setActiveIndex(newIndex)
        const nowScrollTop = document.getElementById(POPOVER_ELEMENT_ID)!.scrollTop
        if (newIndex * itemHeight < nowScrollTop) {
          document.getElementById(POPOVER_ELEMENT_ID)!.scrollTop =
            newIndex === 0 ? 0 : newIndex * itemHeight
        }
      }
    }

    // 拦截 enter 回车
    if (e.code === 'Enter') {
      // 阻止默认的回车事件，避免换行
      e.preventDefault()
      const currentTime = new Date().getTime()

      // 触发自定义回车事件
      if (popoverVisible && members.length > 0 && !isComposing) {
        onSelectMember(members[activeIndex])
      } else if (!isComposing && currentTime - lastKeyPressTime.current > 100) {
        onConfirm && onConfirm(e)
      }
    }
    // 拦截 ctrl + enter 触发换行
    if (e.ctrlKey && e.code === 'Enter') {
      e.preventDefault()
      createBrElement()
    }
  }
  const onInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText
      setInputValue(text)
    }
    onInputDataChange()
  }

  const [isFocus, setIsFocus] = useState(false)
  const onInputFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    onFocus && onFocus(e)
    setIsFocus(true)
    // fix: 加上延时处理，避免 getEditorRange 获取到错误的节点
    setTimeout(() => {
      checkIsShowSelectPopover()
    }, 0)
  }

  const cachedPosition = useRef<Range | null>(null)
  const onInputBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    onBlur && onBlur(e)

    if (editorRef.current) {
      const rangeInfo = getEditorRange()
      cachedPosition.current = rangeInfo?.range || null
    }

    setIsFocus(false)
    // 设置延时，避免选择 @成员 时，弹窗直接消失
    setTimeout(() => {
      closeMembersPopover()
    }, 200)
  }

  useImperativeHandle(ref, () => {
    return {
      focus() {
        // 延时，避免光标定位到输入框的最前面
        editorRef.current?.focus()
      },
      createEmoji(url: string) {
        const emoji = createEmoji({ url, offset: 0 })
        insertEmoji(emoji)
      }
    }
  }, [])

  return (
    <div className={cs('relative w-full h-full', className)}>
      {/* 输入框 */}
      <div
        ref={editorRef}
        className={cs(
          'w-full h-full min-h-[40px] p-2 bg-module',
          'border border-solid border-module rounded-sm',
          'text-primary-l break-all',
          'focus-within:bg-white focus-within:border-blue-600',
          'overflow-auto transition-all',
          {
            'cursor-not-allowed bg-module': disabled
          }
        )}
        contentEditable
        onKeyUp={onInputKeyUp}
        onKeyDown={onInputKeyDown}
        onCompositionStart={onInputCompositionStart}
        onCompositionEnd={onInputCompositionEnd}
        onFocus={onInputFocus}
        onInput={onInput}
        onBlur={onInputBlur}
      ></div>
      {/* @成员弹窗 */}
      {popoverVisible && (
        <div
          id={POPOVER_ELEMENT_ID}
          className={cs(
            'fixed z-[1090]',
            `max-h-[300px] overflow-auto`,
            'border border-solid border-primary-b',
            'bg-white shadow-md'
          )}
          style={{
            width: `${popoverWidth}px`,
            top: `${popoverPosition.y - 8 - members.length * 50}px`,
            left: `${popoverPosition.x}px`
          }}
        >
          {members.map((member, index) => (
            <div
              className={cs(
                'w-full p-2',
                'gap-x-2 flex items-center justify-start',
                'border-b border-solid border-primary-b last:border-transparent',
                'cursor-pointer hover:bg-module',
                {
                  'bg-module': index === activeIndex
                }
              )}
              key={member.userId}
              onClick={() => onSelectMember(member)}
            >
              <img src={member.avatar} className={cs('w-8 h-8', 'rounded-md', 'cursor-pointer')} />
              <div className="text-sm text-primary-l">{`${member.username}`}</div>
            </div>
          ))}
        </div>
      )}
      {/* placeholder展示 */}
      {!(inputValue && inputValue.length > 0 && inputValue !== '\n') &&
        !isFocus &&
        placeholder.length > 0 && (
          <div className={cs('absolute top-2 left-2', 'text-light-l pointer-events-none')}>
            {placeholder}
          </div>
        )}
    </div>
  )
})

export default ChatInput
