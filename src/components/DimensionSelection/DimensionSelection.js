import React from 'react';
import styles from '../../styles/DimensionSelection/DimensionSelection.module.css';
import CheckboxTable from './CheckboxTable';
import { useState } from 'react';
import DimensionColorMapping from './DimensionColorMapping';
import VegetationIndexInputs from './VegetationIndexInputs';

const DimensionSelection = ({ onFetchChartData, equations, onEquationChange }) => {
  
  const [selectedOptions, setSelectedOptions] = useState({
    genotype: [],
    treatment: [],
    time: []
  });

  return (
    <div className={styles.firstColumn}>
      <div className={styles.dimensionSelection}>
        <h2 className={styles.dimensionTitle}>
          Dimension Selection
        </h2>
        <CheckboxTable onFetchChartData={onFetchChartData} />
      </div>
      <div>
        <VegetationIndexInputs
          equations={equations}
          onEquationChange={onEquationChange}
        />
      </div>
      

      <div className={styles.thirdRow}>
        <h2 className={styles.dimensionTitle}>
          Feature Demonstration
        </h2>
        
        <div>
          <img src="demo1.png" style={{ width: '99%', height: '100%', margin: '2px' }} />
        </div>

        <div className={styles.thirdRowEach}>
          <img src="demo2.png" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div>
        <DimensionColorMapping/>
      </div>
      
      
    </div>
  );
};

export default DimensionSelection;
