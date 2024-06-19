import React, { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const PointCloud = ({ points }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const { camera, size } = useThree();
  const pointsRef = useRef();

  const mesh = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    points.forEach(point => {
      positions.push(point.x, point.y, point.z);
      color.set(point.color);
      colors.push(color.r, color.g, color.b);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 1, vertexColors: true, sizeAttenuation: false });
    return new THREE.Points(geometry, material);
  }, [points]);

  const handlePointerMove = (event) => {
    event.stopPropagation();
    const { index } = event;
    setHoveredPoint(points[index]);
  };

  const handlePointerOut = () => {
    setHoveredPoint(null);
  };

  useFrame(() => {
    if (hoveredPoint) {
      const vector = new THREE.Vector3(hoveredPoint.x, hoveredPoint.y, hoveredPoint.z);
      vector.project(camera);
      hoveredPoint.screenPosition = {
        x: (vector.x * 0.5 + 0.5) * size.width,
        y: (vector.y * -0.5 + 0.5) * size.height
      };
    }
  });

  return (
    <>
      <primitive
        ref={pointsRef}
        object={mesh}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      />
      {hoveredPoint && hoveredPoint.screenPosition && (
        <Html>
          <div style={{
            position: 'absolute',
            // top: hoveredPoint.screenPosition.y,
            // left: hoveredPoint.screenPosition.x,
            top: -50,
            left: -50,
            // transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            // background: 'rgba(0, 0, 0, 0.8)',
            padding: '5px',
            borderRadius: '3px',
            pointerEvents: 'none'
          }}>
            {hoveredPoint.label}
          </div>
        </Html>
      )}
    </>
  );
};

export default PointCloud;
