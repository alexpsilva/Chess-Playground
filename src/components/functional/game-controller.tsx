import React, { useState } from "react"
import { BoardPosition, Marker, Move, Piece, PieceColor, PiecePosition, PieceType } from "../../entities"
import { BoardPresentation } from "../presentational/board"

const board = BoardPosition.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

export const GameController = () => {
  const [pieces, setPieces] = useState(board.pieces)
  const [markers, setMarkers] = useState({})
  const [selectedPiece, setSelectedPiece] = useState(undefined)
  const [colorPlaying, setColorPlaying] = useState(PieceColor.white)

  const selectPiece = (pieceId: number) => {
    const legalMoves = board.legalMoves(pieceId)
    setMarkers(legalMoves.map((move, index): Marker => ({
      id: index,
      position: move.destination
    })))
    setSelectedPiece(pieceId)
  }

  const movePiece = (move: Move) => {
    // (to-do) check for capture
    board.movePiece(move)
    setMarkers([])
    setPieces(board.pieces)
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
        pieceId: pieces[selectedPiece].id,
        destination: markers[markerId].position
      })
    }}
  />
}