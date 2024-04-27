import { createSlice } from '@reduxjs/toolkit'
import type { Profile } from '@/gql/graphql'

const initialUserInfo: { userInfo: Profile | null } = {
  userInfo: null
}

const UserSlice = createSlice({
  name: 'user',
  initialState: initialUserInfo,
  reducers: {
    setUserInfo: (state, val) => {
      state.userInfo = val.payload
    }
  }
})

export const { setUserInfo } = UserSlice.actions
export default UserSlice.reducer
