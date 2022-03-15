import React from "react"
import { PieceColor, PiecePositionColumn, PieceType } from "../../interfaces/piece"
import { Board } from "../presentational/Board"

export const GameController = () => {
  return <Board 
    pieces={[
      {id: 15, type: PieceType.bishop, color: PieceColor.black, position: {col: PiecePositionColumn.D, row: 3}}
    ]}
    onPieceClick={(pieceId: number) => { 
      console.log(pieceId)
    }}
  />
}