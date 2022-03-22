import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import pieceReducer from '../features/piece/slice'
import boardPositionReducer from '../features/board-position/slice'
import gameReducer from '../features/game/slice'

export const store = configureStore({
  reducer: {
    pieces: pieceReducer,
    boardPosition: boardPositionReducer,
    game: gameReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>