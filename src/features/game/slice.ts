import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Piece } from "../../entities";
import { PieceColor } from "../../entities/enums";
import { FENParser } from "../../parsers/fen";
import { AppThunk, RootState } from "../../redux";
import { addPiece } from "../board-position/slice";

export interface GameState {
  currentTurn: number
}

const initialState: GameState = {
  currentTurn: 1
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTurn: (state, { payload }: PayloadAction<number>) => {
      state.currentTurn = payload
    },
    nextTurn: (state) => {
      state.currentTurn = state.currentTurn + 0.5
    },
  },
});

export const fromFEN = (FEN: string): AppThunk => (
  dispatch,
  getState
) => {
  const { pieces, playingColor, fullmoveNumber } = FENParser.parse(FEN)
  dispatch(setTurn(fullmoveNumber + (playingColor === PieceColor.black ? 0.5 : 0.0)))
  for(const piece of pieces) {
    dispatch(addPiece(piece))
  }
}

export const start = (): AppThunk => (
  dispatch,
  getState
) => {
  dispatch(fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
}

export const { setTurn, nextTurn } = gameSlice.actions;

export const selectPlayingColor = (state: RootState) => {
  return state.game.currentTurn % 0.5 ? PieceColor.black : PieceColor.white
}

export default gameSlice.reducer;