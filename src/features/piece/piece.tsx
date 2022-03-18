import React from 'react';
import { connect } from 'react-redux';
import { PieceType, PieceColor } from '../../entities/enums';
import { selectPiece } from './slice';

const Piece = ({id, type, color, onClick = () => {}, children}: {
  id: string,
  type: PieceType,
  color: PieceColor,
  onClick?: (id: string) => void,
  children?
}) => (
  <div 
    id={`piece-${id}`}
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/pieces/${color}-${type}.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      width: '100%',
      height: '100%'
    }}
    onClick={() => onClick(id)}
  >
    {children}
  </div>
)

function mapStateToProps(state, ownProps: {id: string}) {
  const piece = selectPiece(state, ownProps.id)
  return {type: piece.type, color: piece.color}
}

export default connect(mapStateToProps)(Piece)