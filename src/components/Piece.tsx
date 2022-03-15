import React from 'react';

export const Piece = ({
  type,
  color
}) => (
  <div style={{
      background: `url(${process.env.PUBLIC_URL}/pieces/${color}/${type}.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      width: '100%',
      height: '100%'
    }}
  />
)