import React, { useState } from "react"
import { Marker, Move, Piece, PieceColor, PiecePosition, PiecePositionColumn, PiecePositionRow, PieceType } from "../../entities"
import { BoardPresentation } from "../presentational/board"
import { calculateLegalMoves } from "./calculate-legal-moves"

const initialPieces: {[x: number]: Piece} = {
  15: new Piece({id: 15 , type: PieceType.bishop, color: PieceColor.black, position: new PiecePosition({raw: 10})}),
  16: new Piece({id: 16 , type: PieceType.bishop, color: PieceColor.white, position: new PiecePosition({raw: 15})}),
  17: new Piece({id: 17 , type: PieceType.pawn, color: PieceColor.white, position: new PiecePosition({raw: 25})}),
  18: new Piece({id: 18 , type: PieceType.pawn, color: PieceColor.white, position: new PiecePosition({raw: 35})})
}

export const GameController = () => {
  const [pieces, setPieces] = useState(initialPieces)
  const [markers, setMarkers] = useState({})
  const [selectedPiece, setSelectedPiece] = useState(undefined)
  const [colorPlaying, setColorPlaying] = useState(PieceColor.white)

  const selectPiece = (pieceId: number) => {
    const legalMoves = calculateLegalMoves(pieces, pieceId)
    setMarkers(legalMoves.map((move, index): Marker => ({
      id: index,
      position: move.destination
    })))
    setSelectedPiece(pieceId)
  }

  const movePiece = (move: Move) => {
    // (to-do) check for capture
    setPieces({
      ...pieces,
      [move.piece.id]: {
        ...move.piece,
        position: move.destination,
        hasMoved: true
      }
    })
    setMarkers([])
    setSelectedPiece(undefined)
    setColorPlaying(colorPlaying === PieceColor.white ? PieceColor.black: PieceColor.white)
  }

  return <BoardPresentation 
    pieces={Object.values(pieces)}
    markers = {Object.values(markers)}
    onPieceClick={(pieceId: number) => { 
      const piece = pieces[pieceId]

      if(piece.color === colorPlaying) {
        selectPiece(pieceId)
      } else {
        // (to-do) attempt to capture
      }
    }}
    onMarkerClick={(markerId: number) => {
      // we only create markers for legal moves, therefore, we dont need to check if the move is valid
      movePiece({
        piece: pieces[selectedPiece],
        destination: markers[markerId].position
      })
    }}
  />
}