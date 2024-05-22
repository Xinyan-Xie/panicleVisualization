import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementIndividualRadarLabel.module.css';


const SegementTrtDiffLabel = ({ chartsData }) => {
  console.log("chartsData in TrtDiff, ", chartsData)
  const gridRefs = useRef([]);
  gridRefs.current = Array(chartsData["trtMap"]["count"]).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(chartsData["trtMap"]).forEach(trtKey  => {
      if ((trtKey !== 'count')) {
        const cellIndex = chartsData["trtMap"][trtKey];
        const div = gridRefs.current[cellIndex].current;
        if (div) {
          div.innerHTML = `
            <div style="width: 90%;
                        position: relative;
                        // top: 20%;
                        left: 5%;
                        text-align: center;
                        font-size: 20px;
                        background-color: lightgrey;
                        border: 1px solid black;">
              <div style="text-align: center;">${trtKey}</div>
            <div>`;
        
          // Center the text within the parent div
          div.style.display = 'flex';
          div.style.flexDirection = 'column';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'center';
          div.style.height = '100%'; // Ensure the parent div has a defined height
        }
      }
    });
  }
);   
  
  return (
    <div className={styles.segmentIndividualLabelsGroup}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.segmentIndividualLabelsGroupEach}>
        </div>
      ))}
    </div>   
  );
};

export default SegementTrtDiffLabel;
