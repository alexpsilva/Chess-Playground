import { configureStore } from '@reduxjs/toolkit'
import pieceReducer from '../features/piece/slice'
import boardPositionReducer from '../features/board-position/slice'

export const store = configureStore({
  reducer: {
    pieces: pieceReducer,
    boardPosition: boardPositionReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch