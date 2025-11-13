import type { RootState, AppDispatch } from "./store"
import { useSelector, useDispatch } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector