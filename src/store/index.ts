import { configureStore } from '@reduxjs/toolkit'
import Reducers from './slices'

export const store = configureStore({
  reducer: Reducers
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
