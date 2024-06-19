import React, { useState, useEffect } from 'react';
import styles from '../../../styles/branch/branchDay10/BranchDay10PCSelectionView.module.css';
import BranchDay10PCView from './BranchDay10PCView';
import BranchDay10RadarCharts from './BranchDay10RadarCharts';

const BranchDay10PCSelectionView = ( {chartsBranchDataSample} ) => {

  const [selectedBranchOption, setSelectedBranchOption] = useState('');
  const branchIndexArray = Array.from({ length: chartsBranchDataSample["numBranches"] }, (_, index) => index);

  const handleChange = (event) => {
    setSelectedBranchOption(event.target.value);
    console.log('Selected number:', event.target.value); // For demonstration
  };

  return (
    <div className={styles.dayTenPCPlot}>
      <select id="branch-select"
              value={selectedBranchOption}
              onChange={handleChange} 
              style={{ width: '100%', height: '60px' , 
                      marginTop: '3px', marginBottom: '5px', 
                      fontSize: 20}} >
        <option value="" disabled>Select a branch</option>
        {branchIndexArray.map((branchIndex) => (
          <option key={branchIndex} value={branchIndex}>
            branch_{branchIndex}
          </option>
        ))}
      </select>
      <BranchDay10PCView 
        chartsBranchDataSample={chartsBranchDataSample}
        branchIndex={selectedBranchOption} />
      <BranchDay10RadarCharts 
        chartsBranchDataSample={chartsBranchDataSample}
        branchIndex={selectedBranchOption} />
    </div>
  );
};

export default BranchDay10PCSelectionView;