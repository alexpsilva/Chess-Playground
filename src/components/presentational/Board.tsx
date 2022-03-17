import React from 'react';
import styled from 'styled-components'

const Board = styled.div`
  width: 500px;
  height: 500px;
  background: url(${process.env.PUBLIC_URL}/board.png);
  background-repeat: no-repeat;
  background-size: cover;
`

export const BoardPresentation = ({ children }) => (
  <Board>
    {children}
  </Board>
)