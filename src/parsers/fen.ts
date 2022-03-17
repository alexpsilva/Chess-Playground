import { Piece, PiecePosition, PositionedPiece } from "../entities"
import { PieceColor, PieceType } from "../entities/enums"

interface BoardPosition {
  pieces: PositionedPiece[]
  playingColor: PieceColor
}

export class FENParser {
  static parse(FEN: string): BoardPosition {
    const splitFEN = FEN.split(' ')
    if(splitFEN.length !== 6){ throw new Error(`Invalid FEN provided. ${FEN}`) }
    
    let [piecesString, rawPlayingColor] = splitFEN
    piecesString = piecesString.replace(/\//g, '')
    const newBoard: BoardPosition = {
      pieces: [],
      playingColor: rawPlayingColor === 'w' ? PieceColor.white : PieceColor.black
    }


    let currentRaw = 0
    for(let stringIndex = 0; stringIndex < piecesString.length; stringIndex++) {
      const currentChar = piecesString[stringIndex]
      const charToInt = parseInt(currentChar)
      
      if (Number.isInteger(charToInt)) {
        currentRaw += charToInt
      }
      else {
        const piece = new Piece({
          type: currentChar.toLowerCase() as PieceType,
          color: currentChar === currentChar.toUpperCase() ? PieceColor.black : PieceColor.white
        })
        newBoard.pieces.push(new PositionedPiece({piece, position: new PiecePosition({raw: currentRaw + 1})}))
        currentRaw += 1
      }
    }
    return newBoard
  }
}