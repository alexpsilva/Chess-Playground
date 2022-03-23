import React from 'react';
import { PieceType, PieceColor } from '../../../src/entities/enums';

export const PiecePresentation = ({type, color, onClick = () => {}, children}: {
  type: PieceType,
  color: PieceColor,
  onClick?: (event) => void,
  children?
}) => (
  <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/pieces/${color}-${type}.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      width: '100%',
      height: '100%'
    }}
    onClick={onClick}
  >
    {children}
  </div>
)