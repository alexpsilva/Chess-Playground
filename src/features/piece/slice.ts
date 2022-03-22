import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PieceColor, PieceType } from "../../entities/enums";
import { RootState } from "../../redux";

export interface PiecesState {
  piecesById: {[id: string]: PieceState},
}

export interface PieceState {
  id: string
  type: PieceType
  color: PieceColor
}

const initialState: PiecesState = {
  piecesById: {}
}

export const pieceSlice = createSlice({
  name: 'piece',
  initialState,
  reducers: {
    add: (state, { payload }: PayloadAction<PieceState> ) => {
      if(payload.id in state.piecesById) {
        throw new Error(`Cannot add a new piece with id #${payload.id} because it already exists`)
      }
      
      state.piecesById[payload.id] = { ...payload }
      console.log(`[PieceSlice] Added piece #${payload.id}`)
    },
    changeType: (state, {payload: {pieceId, type}}: PayloadAction<{pieceId: string, type: PieceType}>) => {
      state.piecesById[pieceId].type = type
    },
  }
});

export const { add, changeType } = pieceSlice.actions;
export const selectPiece = (state: RootState, pieceId: string): PieceState => state.pieces.piecesById[pieceId];
export const selectLastPieceId = (state: RootState): string => Object.keys(state.pieces.piecesById)[-1]

export default pieceSlice.reducer;