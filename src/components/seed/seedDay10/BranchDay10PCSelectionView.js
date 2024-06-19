import React, { useState, useEffect } from 'react';
import SeedDay10PCView from './SeedDay10PCView';
import BranchSegDay10 from './BranchSegDay10';
import SeedDay10RadarSelectionView from './SeedDay10RadarSelectionView';

const BranchDay10PCSelectionView = ( {chartsBranchDataSample, equations } ) => {

  const [selectedBranchOption, setSelectedBranchOption] = useState('');
  const branchIndexArray = Array.from({ length: chartsBranchDataSample["numBranches"] }, (_, index) => index);

  const handleChange = (event) => {
    setSelectedBranchOption(event.target.value);
    console.log('Selected Branch Index:', event.target.value); // For demonstration
  };

  return (
    <div>
      <select id="branch-select"
              value={selectedBranchOption}
              onChange={handleChange} 
              style={{ width: '100%', height: '50px' , 
                      marginTop: '5px', marginBottom: '5px', 
                      fontSize: 18}} >
        <option value="" disabled>Select a branch</option>
        {branchIndexArray.map((branchIndex) => (
          <option key={branchIndex} value={branchIndex}>
            branch_{branchIndex}
          </option>
        ))}
      </select>

      <BranchSegDay10 
        chartsBranchDataSample={chartsBranchDataSample}
        branchIndex={selectedBranchOption} />
      
      {/* <SeedDay10PCView 
        chartsBranchDataSample={chartsBranchDataSample}
        branchIndex={selectedBranchOption} /> */}
      {/* <SeedDay10RadarSelectionView 
        chartsBranchDataSample={chartsBranchDataSample} 
        branchIndex={selectedBranchOption} 
        equations={equations} /> */}
    </div>
  );
};

export default BranchDay10PCSelectionView;