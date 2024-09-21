import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialCozeState: Global.Coze = {
  conversationId: '',
  question: '',
  answer: 'test',
  isReading: false
}

const CozeSlice = createSlice({
  name: 'coze',
  initialState: initialCozeState,
  reducers: {
    setIsReading(state, action: PayloadAction<boolean>) {
      state.isReading = action.payload
    },
    setAnswer(state, action: PayloadAction<string>) {
      state.answer += action.payload
      // console.log(state.answer)
    },
    setCoze(state, action) {
      if (!action.payload) {
        state.answer = ''
        state.conversationId = ''
        state.question = ''
        state.isReading = false
        return
      }
      const { conversationId, question } = action.payload
      if (!conversationId || !question) return

      // 状态初始化
      state.answer = ''
      state.conversationId = conversationId
      state.question = question
    }
  }
})

export const { setCoze, setAnswer, setIsReading } = CozeSlice.actions
export default CozeSlice.reducer
