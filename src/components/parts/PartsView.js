import React, { useState } from 'react';
import styles from '../../styles/parts/PartsView.module.css';
import ThreePartsButtonSelection from './ThreePartsButtonSelection';
import PartsViewRadarCharts from './PartsViewRadarCharts';
import PartsViewTimeRadar from './PartsViewTimeRadar';
import ImageDivs from './ImageDivs';

const PartsView = ({ dataMaps, equations }) => {

  const [activeButton, setActiveButton] = useState(0);
  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  return (
    <div className={styles.partsView}>
        <div className={styles.buttonContainer}>
            <ThreePartsButtonSelection 
                activeButton={activeButton} 
                handleButtonClick={handleButtonClick} 
            />
        </div>

        {/* <PartsViewRadarCharts 
            dataMaps={dataMaps}
            buttonIndex={activeButton}
        /> */}
        <div className={styles.partsPlotGroup}>
          <div className={styles.examplePlant}>
            <ImageDivs buttonIndex={activeButton} />
          </div>
          <div className={styles.radarBox}>
            <PartsViewTimeRadar 
                dataMaps={dataMaps}
                buttonIndex={activeButton}
                equations={equations}
            />
          </div>
        </div>
        

    </div>


  );
};

export default PartsView;
