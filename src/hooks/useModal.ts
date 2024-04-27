import { useSelector, useDispatch } from 'react-redux'
import { setActiveModal } from '@/store/slices/modal.slice'
import type { RootState } from '@/store'

export function useModal(modal: Global.Modal['activeModal']) {
  const { activeModal } = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch()

  const isOpen = activeModal === modal

  const openModal = () => {
    dispatch(setActiveModal(modal))
  }

  const closeModal = () => {
    dispatch(setActiveModal(null))
  }

  return {
    isOpen,
    openModal,
    closeModal
  }
}
