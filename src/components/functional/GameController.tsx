import React, { useState } from "react"
import { Marker, Piece, PieceColor, PiecePositionColumn, PieceType } from "../../interfaces"
import { Board } from "../presentational/Board"

const initialPieces: {[x: number]: Piece} = {
  15: {id: 15 , type: PieceType.bishop, color: PieceColor.black, position: {col: PiecePositionColumn.D, row: 3}},
  16: {id: 16 , type: PieceType.bishop, color: PieceColor.white, position: {col: PiecePositionColumn.D, row: 2}}
}
const initialMarkers: {[x: number]: Marker} = {
  3: {id: 3, position: {col: PiecePositionColumn.B, row: 2}}
}

export const GameController = () => {
  const [pieces, setPieces] = useState(initialPieces)
  const [markers, setMarkers] = useState(initialMarkers)
  const [selectedPiece, setSelectedPiece] = useState(undefined)
  const [colorPlaying, setColorPlaying] = useState(PieceColor.white)

  console.log(`#${selectedPiece} selected`)

  return <Board 
    pieces={Object.values(pieces)}
    markers = {Object.values(markers)}
    onPieceClick={(pieceId: number) => { 
      const piece = pieces[pieceId]

      if(piece.color === colorPlaying) {
        setSelectedPiece(pieceId)
      } else {
        // (to-do) attempt to capture
      }
    }}
    onMarkerClick={(pieceId: number) => { 
      console.log(`clicked marker #${pieceId}`)
    }}
  />
}