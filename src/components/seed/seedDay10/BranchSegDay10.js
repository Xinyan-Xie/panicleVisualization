import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { ForceGraph3D } from 'react-force-graph';
import BranchSeedDay10ForceGraph3D from './BranchSeedDay10ForceGraph3D';
import styles from '../../../styles/seed/seedDay10/BranchSegDay10.module.css';

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForDay10BranchSeed(text) {
  let nodes = [];
  let links = [];

  const lines = text.split(/\r\n|\n/); 

  let minX = 1000;
  let maxX = -1000;
  let minY = 1000;
  let maxY = -1000;
  let minZ = 1000;
  let maxZ = -1000;

  lines.forEach(line => {
    const wordsArray = line.split(/\s+/); 
    let tempX = parseFloat(wordsArray[0]);
    let tempY = parseFloat(wordsArray[2]);
    let tempZ = parseFloat(wordsArray[1]);
    let colorR = parseInt(wordsArray[3] * 255);
    let colorG = parseInt(wordsArray[4] * 255);
    let colorB = parseInt(wordsArray[5] * 255);
    let pointLabel = parseInt(wordsArray[6]);

    // const [tempX, tempY, tempZ, colorR, colorG, colorB, pointLabel] = wordsArray.map(parseFloat);

    let seedId = 'seed_' + pointLabel;
    let eachPoint = {
      "id": seedId, 
      "name": seedId,
      "color": `rgb(${colorR}, ${colorG}, ${colorB})`,
      // "color": "black",
      "x": tempX,
      "y": tempY,
      "z": tempZ};
    nodes.push(eachPoint);

    minX = minX > tempX ? tempX : minX;
    maxX = maxX < tempX ? tempX : maxX;
    minY = minY > tempY ? tempY : minY;
    maxY = maxY < tempY ? tempY : maxY;
    minZ = minZ > tempZ ? tempZ : minZ;
    maxZ = maxZ < tempZ ? tempZ : maxZ;
  })

  let maxLength = maxX - minX;
  maxLength = maxLength < (maxY - minY) ? (maxY - minY) : maxLength;
  maxLength = maxLength < (maxZ - minZ) ? (maxZ - minZ) : maxLength;

  nodes.forEach(node => {
    node.x = (node.x - (maxX + minX) / 2.0) /  maxLength * 1500;
    node.y = (node.y - (maxY + minY) / 2.0) /  maxLength * 1500;
    node.z = (node.z - (maxZ + minZ) / 2.0) /  maxLength * 1500;
  });
  // let day10BranchSeed = { nodes, links };
  return { nodes, links };
}



const BranchSegDay10 = ({ chartsBranchDataSample, branchIndex }) => {

  const [points, setPoints] = useState({nodes: [], links: []});
  
  useEffect(() => {
    console.log("branchIndex " + branchIndex);
    if (branchIndex) {
    
      let branchName = chartsBranchDataSample["link"].substring(0, 5) + '/' + 
                      chartsBranchDataSample["link"].split('_Info')[0] + '/branchSeg/' + 
                      chartsBranchDataSample["link"].split('_Info')[0] + '_brancheSeg_' + branchIndex + '.txt'
      console.log(branchName)
      fetch(`/data/branchDay10/${branchName}`)
      .then(response => response.text())
      .then(text => {
        setPoints(transformDataForDay10BranchSeed(text));
        })
        .catch(error => console.error('Error fetching data:', error));
    } 
  }, [branchIndex]);
  // });



  return (
    <div className={styles.branchSegDay10}>
      {/* <BranchSeedDay10ForceGraph3D points = {points} /> */}

      {/* <ForceGraph3D
        graphData={points}
        nodeAutoColorBy="color"
        linkDirectionalParticles="value"
        linkDirectionalParticleWidth={2}
        width={210}
        height={210}
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
      />          */}
    </div>
  );
};

export default BranchSegDay10;
