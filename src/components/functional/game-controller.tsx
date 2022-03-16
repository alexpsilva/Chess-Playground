import React, { useState } from "react"
import { BoardPosition, Marker, Move, PieceColor } from "../../entities"
import { BoardPresentation } from "../presentational/board"

const board = BoardPosition.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

export const GameController = () => {
  const [pieces, setPieces] = useState(board.pieces)
  const [markers, setMarkers] = useState({})
  const [selectedPieceId, setSelectedPiece] = useState(undefined)
  const [colorPlaying, setColorPlaying] = useState(PieceColor.white)

  const selectPiece = (pieceId: number) => {
    const legalPositions = board.legalPositions(pieceId)
    setMarkers(legalPositions.map((position, index): Marker => ({
      id: index,
      position
    })))
    setSelectedPiece(pieceId)
  }

  const movePiece = (move: Move) => {
    // (to-do) check for capture
    board.movePiece(move)
    setPieces(board.pieces)
    setColorPlaying(board.colorPlaying)
    
    setMarkers([])
    setSelectedPiece(undefined)
  }

  return <BoardPresentation 
    pieces={pieces}
    markers = {Object.values(markers)}
    onPieceClick={(pieceId: number) => { 
      const piece = board.getPieceById(pieceId)

      if(piece.color === colorPlaying) {
        selectPiece(pieceId)
      } else {
        // (to-do) attempt to capture
      }
    }}
    onMarkerClick={(markerId: number) => {
      // we only create markers for legal moves, therefore, we dont need to check if the move is valid
      movePiece({
        pieceId: selectedPieceId,
        destination: markers[markerId].position
      })
    }}
  />
}