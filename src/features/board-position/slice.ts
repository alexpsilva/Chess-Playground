import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BOARD_SIZE } from "../../constants";
import { PieceColor, PieceType } from "../../entities/enums";
import { AppThunk, RootState } from "../../redux";
import { add, selectLastPieceId } from "../piece/slice";

export interface BoardPositionState {
  positionsById: {[id: string]: [number, number]},
  idsByPosition: string[][],
}

const initialState: BoardPositionState = {
  positionsById: {},
  idsByPosition: Array<Array<string>>(BOARD_SIZE).fill(Array(BOARD_SIZE)),
}

export interface PiecePositionState {
  row: number
  col: number
}

export const boardPositionSlice = createSlice({
  name: 'board-position',
  initialState,
  reducers: {
    movePiece: (state, { payload }: PayloadAction<{pieceId: string, destination: PiecePositionState}>) => {
      const oldPosition = state.positionsById[payload.pieceId]
      if(oldPosition) {
        const [oldRow, oldCol] = oldPosition
        delete state.idsByPosition[oldRow][oldCol]
      } 
      const {row, col} = payload.destination
      state.idsByPosition[row][col] = payload.pieceId
      state.positionsById[payload.pieceId] = [row, col]
    },
    clearPositions: (state) => {
      state.positionsById = {}
      state.idsByPosition = Array<Array<string>>(BOARD_SIZE).fill(Array(BOARD_SIZE))
    }
  },
});

export interface addPieceInput {
  position: PiecePositionState
  type: PieceType
  color: PieceColor
}

export const addPiece = (piece: addPieceInput): AppThunk => (
  dispatch,
  getState
) => {
  const lastPieceId = selectLastPieceId(getState())
  const pieceId = (parseInt(lastPieceId) + 1).toString()

  dispatch(add({id: pieceId, color: piece.color, type: piece.type}))
  dispatch(movePiece({pieceId, destination: piece.position}))
}

export const { movePiece, clearPositions } = boardPositionSlice.actions;

export const selectPositionByPiece = (state: RootState, pieceId: string): PiecePositionState => {
  const [row, col] = state.boardPosition.positionsById[pieceId]
  return {row, col}
};
export const selectPieceByPosition = (state: RootState, position: PiecePositionState): string => {
  return state.boardPosition.idsByPosition[position.row][position.col]
};
export const selectAllPiecePositions = (state: RootState): {[id: string]: PiecePositionState} => {
  return Object.entries(state.boardPosition.positionsById).reduce(
    (allPositions, [pieceId, [row, col]]) => ({...allPositions, [pieceId]: {row, col}}), 
    {}
  )
}

export default boardPositionSlice.reducer;