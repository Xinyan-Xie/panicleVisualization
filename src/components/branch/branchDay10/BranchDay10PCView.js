import React, { useState, useEffect } from 'react';
import PointCloud from './PointCloud';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BranchDay10PCView = ( {chartsBranchDataSample, branchIndex} ) => {

  const [points, setPoints] = useState([]);

  useEffect(() => {
    let minX = 1000;
    let maxX = -1000;
    let minY = 1000;
    let maxY = -1000;
    let minZ = 1000;
    let maxZ = -1000;
    let branchName = chartsBranchDataSample["link"].substring(0, 5) + '/' + 
                     chartsBranchDataSample["link"].split('_Info')[0] + '/branch/' + 
                     chartsBranchDataSample["link"].split('_Info')[0] + '_branches_' + branchIndex + '.txt'
    fetch(`/data/branchDay10/${branchName}`)
    .then(response => response.text())
    .then(text => {
      const pointsData  = [];
      const lines = text.split(/\r\n|\n/); 
      lines.forEach(line => {
        const wordsArray = line.split(/\s+/); 
        if (wordsArray.length >= 6) {

          let tempX = parseFloat(wordsArray[0]);
          let tempY = parseFloat(wordsArray[1]);
          let tempZ = parseFloat(wordsArray[2]);

          pointsData.push({
            x: tempX,
            y: tempY,
            z: tempZ,
            color: `rgb(${wordsArray[3]}, ${wordsArray[4]}, ${wordsArray[5]})`
          });

          minX = minX > tempX ? tempX : minX;
          maxX = maxX < tempX ? tempX : maxX;
          minY = minY > tempY ? tempY : minY;
          maxY = maxY < tempY ? tempY : maxY;
          minZ = minZ > tempZ ? tempZ : minZ;
          maxZ = maxZ < tempZ ? tempZ : maxZ;
        }
      });

      let maxLength = maxX - minX;
      maxLength = maxLength < (maxY - minY) ? (maxY - minY) : maxLength;
      maxLength = maxLength < (maxZ - minZ) ? (maxZ - minZ) : maxLength;
      
      pointsData.forEach(point => {
        point.x = (point.x - (maxX + minX) / 2.0) /  maxLength;
        point.y = (point.y - (maxY + minY) / 2.0) /  maxLength;
        point.z = (point.z - (maxZ + minZ) / 2.0) /  maxLength;
      });

      setPoints(pointsData);
    })
    .catch(error => console.error('Error loading the file', error));
  // });  
  }, [chartsBranchDataSample]);
  

  return (
    <div>
      <Canvas
        camera={{ position: [0, 1.5, 0], fov: 60 }}
        style={{ background: 'white', height: '200px', width: '200px', border: '1px solid darkgray' }}>
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} />
        <PointCloud points={points} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default BranchDay10PCView;