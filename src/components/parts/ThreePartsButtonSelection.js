import React from 'react';
import styles from '../../styles/parts/ThreePartsButtonSelection.module.css';

const ThreePartsButtonSelection = ({ activeButton, handleButtonClick }) => {
  return (
    <div className={styles.buttonView}>
      <button
        onClick={() => handleButtonClick(0)}
        className={`${styles.button} ${activeButton === 0 ? styles.active : ''}`}
        // style={{ backgroundColor: activeButton === 1 ? 'lightgreen' : 'lightgray' }}
      >
        Upper
      </button>
      <button
        onClick={() => handleButtonClick(1)}
        className={`${styles.button} ${activeButton === 1 ? styles.active : ''}`}
        // style={{ backgroundColor: activeButton === 2 ? 'lightgreen' : 'lightgray' }}
      >
        Middle
      </button>
      <button
        onClick={() => handleButtonClick(2)}
        className={`${styles.button} ${activeButton === 2 ? styles.active : ''}`}
        // style={{ backgroundColor: activeButton === 3 ? 'lightgreen' : 'lightgray' }}
      >
        Lower
      </button>
    </div>
  );
};

export default ThreePartsButtonSelection;
