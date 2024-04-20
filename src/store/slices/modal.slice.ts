import { createSlice } from "@reduxjs/toolkit"

const initialModal: Global.Modal = {
    activeModal: null
}

const ModalSlice = createSlice({
    name: 'modal',
    initialState: initialModal,
    reducers: {
        setActiveModal: (state, val) => {
            state.activeModal = val.payload
        }
    }
})

export const { setActiveModal } = ModalSlice.actions

export default ModalSlice.reducer