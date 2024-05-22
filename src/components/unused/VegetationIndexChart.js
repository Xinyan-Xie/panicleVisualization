import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import styles from '../styles/VegetationIndexChart.module.css';

const data = [
  // ... your chart data
];

const VegetationIndexChart = () => {
  return (
    <div className={styles.vegetationIndexChart}>
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        {/* More customization */}
        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        {/* Add other Radar components for more datasets */}
      </RadarChart>
    </div>
  );
};

export default VegetationIndexChart;
