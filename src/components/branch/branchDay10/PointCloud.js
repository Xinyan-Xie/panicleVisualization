import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const PointCloud = ({ points }) => {
  const mesh = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    points.forEach(point => {
      positions.push(point.x, point.y, point.z);
      color.set(point.color);
      colors.push(color.r, color.g, color.b);
      // colors.push(point.r, point.g, point.b);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 1, vertexColors: true, sizeAttenuation: false });
    return new THREE.Points(geometry, material);
  }, [points]);

  return <primitive object={mesh} />;
};

export default PointCloud;
