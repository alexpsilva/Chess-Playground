import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PiecePosition } from "../../entities";
import { PieceColor, PieceType } from "../../entities/enums";
import { RootState } from "../../redux";

export interface BoardPositionState {
  positionsById: {[id: string]: number},
  idsByPosition: {[raw: number]: string},
  lastId: number,
}

export interface PieceState {
  id: string
  type: PieceType
  color: PieceColor

  hasMoved: boolean
}

const initialState: BoardPositionState = {
  positionsById: {'1': 5},
  idsByPosition: {5: '1'},
  lastId: 0 
}

export const boardPositionSlice = createSlice({
  name: 'board-position',
  initialState,
  reducers: {
    move: (state, { payload }: PayloadAction<{pieceId: string, destination: PiecePosition}>) => {
      const oldRawPosition = state.positionsById[payload.pieceId]
      delete state.idsByPosition[oldRawPosition]
      state.idsByPosition[payload.destination.raw] = payload.pieceId
      state.positionsById[payload.pieceId] = payload.destination.raw
    },
  },
});

export const { move } = boardPositionSlice.actions;
export const selectPositionByPiece = (state: RootState, pieceId: string) => {
  return new PiecePosition({raw: state.boardPosition.positionsById[pieceId]})
};
export const selectPieceByPosition = (state: RootState, raw: number) => {
  return state.boardPosition.idsByPosition[raw]
};
export const selectAllPiecePositions = (state: RootState) => {
  return state.boardPosition.positionsById
}

export default boardPositionSlice.reducer;