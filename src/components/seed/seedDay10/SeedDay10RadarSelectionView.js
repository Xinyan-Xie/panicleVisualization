import React, { useState, useEffect } from 'react';
import SeedDay10RadarCharts from './SeedDay10RadarCharts';

const SeedDay10RadarSelectionView = ( {chartsBranchDataSample, branchIndex, equations } ) => {

  const [selectedSeedOption, setSelectedSeedOption] = useState('');
  const seedIndexArray = Array.from({ length: chartsBranchDataSample["noSeedList"][branchIndex] }, 
                                        (_, index) => index);

  const handleChange = (event) => {
    setSelectedSeedOption(event.target.value);
    console.log('Selected Seed Index:', event.target.value); // For demonstration
  };

  return (
    <div>
      <select id="seed-select"
              value={selectedSeedOption}
              onChange={handleChange} 
              style={{ width: '100%', height: '50px' , 
                      marginTop: '5px', marginBottom: '5px', 
                      fontSize: 18}} >
        <option value="" disabled>Select a seed</option>
        {seedIndexArray.map((seedIndex) => (
          <option key={seedIndex} value={seedIndex}>
            seed_{seedIndex}
          </option>
        ))}
      </select>
      <SeedDay10RadarCharts 
        chartsBranchDataSample={chartsBranchDataSample}
        branchIndex={branchIndex}
        seedIndex={selectedSeedOption} 
        equations={equations} />
    </div>
  );
};

export default SeedDay10RadarSelectionView;