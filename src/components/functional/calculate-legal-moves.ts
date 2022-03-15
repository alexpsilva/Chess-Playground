import { Piece, Move, PieceType, PiecePosition } from "../../entities"

export const calculateLegalMoves = (pieces: {[x: number]: Piece}, pieceId: number): Move[] => {
  const piece = pieces[pieceId]
  let candidateMoves: Move[] = []

  switch(piece.type){
    case PieceType.pawn:
      // (to-do) check pawn direction
      candidateMoves = [
        ...candidateMoves,
        { piece, destination: new PiecePosition({ raw: piece.position.raw + 8 }) }
      ]
      if(!piece.hasMoved) {
        candidateMoves = [
          ...candidateMoves,
          { piece, destination: new PiecePosition({ raw: piece.position.raw + 16 }) }
        ]
      }
      // (to-do) standard capture
      // (to-do) en-passant  capture
  }

  // (to-do) check move in bounds
  // (to-do) check move is blocked
  // (to-do) check move legal (doesn`t expose the king)
  return candidateMoves
}
