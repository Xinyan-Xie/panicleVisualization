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
      <div>
        <DimensionColorMapping/>
      </div>
      
    </div>
  );
};

export default DimensionSelection;
