import React from 'react';
import styles from '../../styles/DimensionSelection/DimensionSelection.module.css';
import CheckboxTable from './CheckboxTable';
import { useState } from 'react';
import DimensionColorMapping from '../unused/DimensionColorMapping';

const DimensionSelection = ({ onFetchChartData }) => {
  
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
        <DimensionColorMapping/>
      </div>
    </div>
  );
};

export default DimensionSelection;
