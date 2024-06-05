import React, { useState, useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';
import BranchDay10PCSelectionView from './BranchDay10PCSelectionView';
import styles from '../../../styles/branch/branchDay10/BranchDay10ForceGraph3D.module.css';

const BranchDay10ForceGraph3D = ( {chartsBranchData} ) => {

  return (
    <div className={styles.dayTenOutline}>

      {Object.keys(chartsBranchData).map((sampleKey, index)  => {
        return (
          <div key={index} className={styles.DayTenViewIndividual}>
            <div className={styles.DayTenGraph}>
              <ForceGraph3D
                graphData={chartsBranchData[sampleKey]["data"]}
                nodeAutoColorBy="color"
                linkDirectionalParticles="value"
                linkDirectionalParticleWidth={2}
                width={200}
                height={550}
                showNavInfo={false}
                nodeThreeObject={node => {
                  const material = new THREE.MeshBasicMaterial({ color: node.color });
                  const geometry = new THREE.SphereGeometry(3); // Adjust size here
                  return new THREE.Mesh(geometry, material);
                }}
                linkMaterial={link => {
                  return new THREE.LineBasicMaterial({
                    color: link.color || 'lightgreen',
                    linewidth: 2 // Adjust link width here
                  });
                }}
                dagLevelDistance={null}
                enableNodeDrag={false} // Disables node dragging
                backgroundColor="white"  // Set background color to white
                cooldownTicks={0} // Stop simulation immediately
                onEngineTick={() => null} // Override physics engine ticks
                onEngineStop={() => console.log('Simulation stopped')} // Notification on simulation stop
                // nodeLabel={() => ''} // Override default tooltip
              />         
            </div>
            <BranchDay10PCSelectionView chartsBranchDataSample={chartsBranchData[sampleKey]} />
          </div>
        );
      })}
    </div>
    
  );
};

export default BranchDay10ForceGraph3D;



