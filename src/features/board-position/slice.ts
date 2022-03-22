import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PiecePosition } from "../../entities";
import { PieceColor, PieceType } from "../../entities/enums";
import { AppThunk, RootState } from "../../redux";
import { add, selectLastPiece, selectLastPieceId } from "../piece/slice";

export interface BoardPositionState {
  positionsById: {[id: string]: number},
  idsByPosition: {[raw: number]: string},
  lastId: number,
}

const initialState: BoardPositionState = {
  positionsById: {},
  idsByPosition: {},
  lastId: 0 
}

export const boardPositionSlice = createSlice({
  name: 'board-position',
  initialState,
  reducers: {
    move: (state, { payload }: PayloadAction<{pieceId: string, destination: PiecePosition}>) => {
      const oldRawPosition = state.positionsById[payload.pieceId]
      if(oldRawPosition) {
        delete state.idsByPosition[oldRawPosition]
      }
      state.idsByPosition[payload.destination.raw] = payload.pieceId
      state.positionsById[payload.pieceId] = payload.destination.raw
    },
  },
});

export interface addPieceInput {
  position: PiecePosition
  type: PieceType
  color: PieceColor
}

export const addPiece = (piece: addPieceInput): AppThunk => (
  dispatch,
  getState
) => {
  const lastPieceId = selectLastPieceId(getState()) ?? '0'
  const pieceId = (parseInt(lastPieceId) + 1).toString()

  dispatch(add({id: pieceId, color: piece.color, type: piece.type}))
  dispatch(move({pieceId, destination: piece.position}))
}

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