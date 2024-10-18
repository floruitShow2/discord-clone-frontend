import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialCozeState: Global.Coze = {
  conversationId: '',
  question: '',
  markId: '',
  answer: '',
  isReading: false
}

const CozeSlice = createSlice({
  name: 'coze',
  initialState: initialCozeState,
  reducers: {
    setIsReading(state, action: PayloadAction<boolean>) {
      state.isReading = action.payload
    },
    setAnswer(state, action: PayloadAction<{ markId: string; content: string }>) {
      const { markId, content } = action.payload
      if (state.markId === '' || state.markId === markId) {
        state.markId = markId
        console.log(state.markId)
        state.answer += content
      }
    },
    setCoze(state, action) {
      if (!action.payload) {
        state.answer = ''
        state.markId = ''
        state.conversationId = ''
        state.question = ''
        state.isReading = false
        return
      }
      const { conversationId, question } = action.payload
      if (!conversationId || !question) return

      // 状态初始化
      state.answer = ''
      state.markId = ''
      state.conversationId = conversationId
      state.question = question
    }
  }
})

export const { setCoze, setAnswer, setIsReading } = CozeSlice.actions
export default CozeSlice.reducer
