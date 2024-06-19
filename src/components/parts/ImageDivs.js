import React from 'react';
import styles from '../../styles/parts/ImageDivs.module.css'; // Create a CSS file for styling

const ImageDivs = ({ buttonIndex }) => {
  const transparencies = [0.9, 0.9, 0.9];
  const borders = [null, null, null];

  if (buttonIndex !== null && buttonIndex >= 0 && buttonIndex < transparencies.length) {
    transparencies[buttonIndex] = 0;
    borders[buttonIndex] = '2px solid darkgray'; // Define the border style
  }

  return (
    <div className={styles.image_container}>
      <div className={styles.overlay_div} style={{ border: borders[0] }}>
        <div className={styles.inner_div} style={{ opacity: transparencies[0] }}></div>
      </div>
      <div className={styles.overlay_div} style={{ border: borders[1] }}>
        <div className={styles.inner_div} style={{ opacity: transparencies[1] }}></div>
      </div>
      <div className={styles.overlay_div} style={{ border: borders[2] }}>
        <div className={styles.inner_div} style={{ opacity: transparencies[2] }}></div>
      </div>
    </div>
  );
};

export default ImageDivs;
