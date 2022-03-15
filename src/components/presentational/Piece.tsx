import React from 'react';
import { PieceColor, PieceType } from '../../interfaces/piece';

export const Piece = ({type, color, onClick = () => {}}: {
  type: PieceType,
  color: PieceColor,
  onClick: (event) => void
}) => (
  <div style={{
      background: `url(${process.env.PUBLIC_URL}/pieces/${color}/${type}.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      width: '100%',
      height: '100%'
    }}
    onClick={onClick}
  />
)