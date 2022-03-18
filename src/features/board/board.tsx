import React from 'react';

export const Board = ({ children }) => (
  <div style={{
    width: 'inherit',
    height: 'inherit',
    backgroundImage: 'url(${process.env.PUBLIC_URL}/board.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }}>
    {children}
  </div>
)