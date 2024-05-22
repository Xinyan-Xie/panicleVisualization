import React, { useState, useEffect } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';
import styles from '../../../styles/branch/branchDay10/BranchDay10PCView.module.css';
import PointCloud from './PointCloud';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BranchDay10PCView from './BranchDay10PCView';

const BranchDay10PCSelectionView = ( {chartsBranchDataSample} ) => {

  const [selectedBranchOption, setSelectedBranchOption] = useState('');
  const branchIndexArray = Array.from({ length: chartsBranchDataSample["numBranches"] }, (_, index) => index);

  const handleChange = (event) => {
    setSelectedBranchOption(event.target.value);
    console.log('Selected number:', event.target.value); // For demonstration
  };

  return (
    <div className={styles.dayTenPCPlot}>
      <div>
        {/* <label htmlFor="branch-select">Choose a branch based on index:</label> */}
        <select id="branch-select"
                value={selectedBranchOption}
                onChange={handleChange} 
                style={{ width: '100%', height: '40px' , marginTop: '5px', marginBottom: '5px' }}
        >
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

        {/* {selectedBranchOption && ( <p>You have selected: {selectedBranchOption}</p>)} */}
      </div>


    </div>
  );
};

export default BranchDay10PCSelectionView;