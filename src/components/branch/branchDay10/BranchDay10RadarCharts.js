import React, { useEffect, useRef } from 'react';
import { RadarChart } from '../../RadarChart'; // Import the RadarChart function
import styles from '../../../styles/branch/branchDay10/BranchDay10RadarCharts.module.css';

function transformDataForNone() {
  const radarData = [
    {axis: "volumeBranch", value: 0,},
    {axis: "lengthBranch", value: 0, },
    {axis: "angleBranch", value: 0, },
    {axis: "noSeed", value: 0, },
    {axis: "branchAverageR", value: 0, },
    {axis: "branchAverageG", value: 0, },
    {axis: "branchAverageB", value: 0, },
    {axis: "branchAverageBB", value: 0, },
  ];
  return [radarData];
}

const BranchDay10RadarCharts = ({ chartsBranchDataSample, branchIndex }) => {
  const radarRef = useRef();

  useEffect(() => {
    let data;
    if (branchIndex) {
      data = chartsBranchDataSample["radarData"]["branch_" + branchIndex];
    } else {
      data = transformDataForNone();
    }

    RadarChart(radarRef.current, data, [chartsBranchDataSample["color"]], 210, 210);
  }, [chartsBranchDataSample, branchIndex]);

  return (
    <div ref={radarRef} className={styles.branchDay10RadarChart}></div>
  );
};

export default BranchDay10RadarCharts;
