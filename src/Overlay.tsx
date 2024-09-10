import React from 'react';

const Overlay: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      pointerEvents: 'none',
    }}>
     
    </div>
  );
};

export default Overlay;