import { Piece, PiecePosition, PositionedPiece } from "../entities"
import { PieceColor, PieceType } from "../entities/enums"
import { addPieceInput } from "../features/board-position/slice"

export class FENParser {
  static parse(FEN: string): {pieces: addPieceInput[], playingColor: PieceColor, fullmoveNumber: number} {
    const splitFEN = FEN.split(' ')
    if(splitFEN.length !== 6){ throw new Error(`Invalid FEN provided. ${FEN}`) }
    
    let [
      piecesString, 
      rawPlayingColor, 
      castleAvailability, 
      enPassantTarget, 
      halfmoveClock, 
      fullmoveNumber
    ] = splitFEN
    const playingColor = rawPlayingColor === 'w' ? PieceColor.white : PieceColor.black
    const pieces: addPieceInput[] = []
    
    piecesString = piecesString.replace(/\//g, '')
    let currentRaw = 0
    for(let stringIndex = 0; stringIndex < piecesString.length; stringIndex++) {
      const currentChar = piecesString[stringIndex]
      const charToInt = parseInt(currentChar)
      
      if (Number.isInteger(charToInt)) {
        currentRaw += charToInt
      }
      else {
        const position = new PiecePosition({raw: currentRaw + 1})
        pieces.push({
          type: currentChar.toLowerCase() as PieceType,
          color: currentChar === currentChar.toUpperCase() ? PieceColor.black : PieceColor.white,
          position: {row: position.row - 1, col: position.col - 1}
        })
        currentRaw += 1
      }
    }
    return { pieces, playingColor, fullmoveNumber: parseInt(fullmoveNumber) }
  }
}