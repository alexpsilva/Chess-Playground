import React, { useState } from "react"
import { BoardPosition, Marker, Move, Piece, PieceColor, PiecePosition, PieceType } from "../../entities"
import { BoardPresentation } from "../presentational/board"
import { calculateLegalMoves } from "./calculate-legal-moves"

const board = BoardPosition.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

export const GameController = () => {
  const [pieces, setPieces] = useState(board.pieces)
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
    board.movePiece(move)
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
    pieces={pieces}
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