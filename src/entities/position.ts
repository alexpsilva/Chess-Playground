export class PiecePosition {
  raw: number

  constructor(position: {
    coordinates?: PieceCoordinates,
    raw?: number
  }) {
    this.raw = position.raw ?? PiecePosition.rawFromCoordinates(position.coordinates)
  }

  get row(): PiecePositionRow {
    return PiecePosition.rowFromRaw(this.raw)
  }

  get col(): PiecePositionColumn {
    return PiecePosition.colFromRaw(this.raw)
  }

  static rawFromCoordinates(coordinates: PieceCoordinates): number {
    return coordinates.col + 8 * (coordinates.row - 1)
  }

  static coordinatesFromRaw(raw: number): PieceCoordinates {
    return {
      row: PiecePosition.rowFromRaw(raw),
      col: PiecePosition.colFromRaw(raw)
    }
  }

  static rowFromRaw(raw: number): PiecePositionRow {
    return Math.ceil(raw / 8)
  }

  static colFromRaw(raw: number): PiecePositionColumn {
    return ((raw - 1) % 8) + 1
  }
}

export interface PieceCoordinates {
  row: PiecePositionRow,
  col: PiecePositionColumn
}

export enum PiecePositionRow {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
}

export enum PiecePositionColumn {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
  F = 6,
  G = 7,
  H = 8,
}