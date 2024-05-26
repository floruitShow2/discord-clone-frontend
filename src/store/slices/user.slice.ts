import { createSlice } from '@reduxjs/toolkit'

const initialUserInfo: { userInfo: User.UserEntity | null } = {
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
