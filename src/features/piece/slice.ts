import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PieceColor, PieceType } from "../../entities/enums";
import { RootState } from "../../redux";

export interface PiecesState {
  piecesById: {[id: string]: PieceState},
  lastId: number,
}

export interface PieceState {
  id: string
  type: PieceType
  color: PieceColor
}

const initialState: PiecesState = {
  piecesById: {
    '1': {
      id: '1',
      color: PieceColor.black,
      type: PieceType.bishop
    }
  },
  lastId: 0 
}

export const pieceSlice = createSlice({
  name: 'piece',
  initialState,
  reducers: {
    add: (state, { payload }: PayloadAction<{type: PieceType, color: PieceColor}> ) => {
      const pieceId = state.lastId++
      state.piecesById[pieceId] = {
        id: pieceId.toString(),
        ...payload
      }
    },
    changeType: (state, {payload: {pieceId, type}}: PayloadAction<{pieceId: string, type: PieceType}>) => {
      state.piecesById[pieceId].type = type
    },
  },
});

export const { add, changeType } = pieceSlice.actions;
export const selectPiece = (state: RootState, pieceId: string) => state.pieces.piecesById[pieceId];

export default pieceSlice.reducer;