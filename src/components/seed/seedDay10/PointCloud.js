import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const PointCloud = ({ points }) => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [clickedLabel, setClickedLabel] = useState(null);
  const pointsRef = useRef();
  const { camera } = useThree();

  const mesh = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    points.forEach((point) => {
      positions.push(point.x, point.y, point.z);
      color.set(point.color);
      // color.setRGB(point.r / 255, point.g / 255, point.b / 255); // Normalize RGB values to [0, 1]
      colors.push(color.r, color.g, color.b);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 1, vertexColors: true, sizeAttenuation: false });
    return new THREE.Points(geometry, material);
  }, [points]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(pointsRef.current);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        setClickedPoint(intersect.point);
        setClickedLabel(points[intersect.index].label);
      } else {
        setClickedPoint(null);
        setClickedLabel(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [camera, points]);

  return (
    <group>
      <primitive object={mesh} ref={pointsRef} />
      {clickedPoint && clickedLabel && (
        <Html position={[clickedPoint.x, clickedPoint.y, clickedPoint.z]}>
          <div className="label">{clickedLabel}</div>
        </Html>
      )}
    </group>
  );
};

export default PointCloud;
