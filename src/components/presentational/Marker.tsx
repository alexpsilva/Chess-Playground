import React from 'react';

export const MarkerPresentation = ({onClick = () => {}}: {
  onClick?: (event) => void
}) => (
  <div style={{
      backgroundColor: 'rgb(0, 0, 0, .1)',
      backgroundClip: 'content-box',
      borderRadius: '50%',
      width: '25%',
      height: '25%',
      padding: '37.5%'
    }}
    onClick={onClick}
  />
)