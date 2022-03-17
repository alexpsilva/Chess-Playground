import { PiecePosition } from ".";

export class Marker {
  id: string
  position: PiecePosition

  constructor(marker: {
    id: string,
    position: PiecePosition
  }) {
    this.id = marker.id
    this.position = marker.position
  }
}