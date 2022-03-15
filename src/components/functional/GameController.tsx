import React from "react"
import { PieceColor, PiecePositionColumn, PieceType } from "../../interfaces"
import { Board } from "../presentational/Board"

export const GameController = () => {
  return <Board 
    pieces={[
      {id: 15 , type: PieceType.bishop, color: PieceColor.black, position: {col: PiecePositionColumn.D, row: 3}}
    ]}
    markers = {[
      {id: 3, position: {col: PiecePositionColumn.B, row: 2}}
    ]}
    onPieceClick={(pieceId: number) => { 
      console.log(`clicked piece #${pieceId}`)
    }}
    onMarkerClick={(pieceId: number) => { 
      console.log(`clicked marker #${pieceId}`)
    }}
  />
}