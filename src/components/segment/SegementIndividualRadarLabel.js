import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementIndividualRadarLabel.module.css';


const SegementIndividualRadarLabel = ({ chartsData }) => {

  const gridRefs = useRef([]);
  gridRefs.current = Array(chartsData["numIndex"]).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(chartsData).forEach(sampleKey  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        if ((chartsData[sampleKey]["4D"]) && 
            (chartsData[sampleKey]["7D"]) && 
            (chartsData[sampleKey]["10D"])) {
          const cellIndex = chartsData[sampleKey]["4D"]["sampleIndex"];
          const div = gridRefs.current[cellIndex].current;
          let genoPart = sampleKey.split(' x ')[0];
          let trtPart = sampleKey.split(' x ')[1];
          // let textColor = chartsData[sampleKey]["4D"]["color"];
          if (div) {
            // const newDiv = document.createElement('div');
            // newDiv.textContent = genoPart;
            // div.appendChild(newDiv);
            div.innerHTML = `
              <div style="height: 50px; width: 90%; 
                          text-align: center;
                          font-size: 18px;
                          font-weight: bold;
                          border-radius: 10px;
                          color: ${chartsData[sampleKey]["10D"]["color"]};
                          border: 1px solid ${chartsData[sampleKey]["4D"]["color"]};
              ">
                <div style="text-align: center;">${genoPart}</div>
                <div style="text-align: center;">${trtPart}</div>
              <div>`;
          
            // Center the text within the parent div
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.height = '100%'; // Ensure the parent div has a defined height
          }
        }
      }
    });
  }, [chartsData]);   
  // }, []);
  // });
  
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

export default SegementIndividualRadarLabel;
