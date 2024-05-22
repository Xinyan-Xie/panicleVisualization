import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from '../../../styles/branch/branchGeneral/SpreadOfBranchesGraph.module.css';

const SpreadOfBranchesGraph = ({ dataMaps, colorMapping }) => {
  const [chartsData, setChartsData] = useState({});
  const canvasRefs = useRef({});

  useEffect(() => {
    console.log(dataMaps);
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject]) => {
      Object.entries(sampleObject).forEach(([dayKey, sampleDayObject]) => {
        if (sampleDayObject.link) {
          fetch(`/data/${sampleDayObject.link}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('Fetched data:', data);
              const branchIndices = Object.keys(data.branch).filter(key => key.startsWith('branchInd_'));
              const spreadData = branchIndices.map(key => ({
                branchIndex: key,
                branchSpread: data.branch[key].branchSpread,
              }));

              setChartsData((prevData) => ({
                ...prevData,
                [sampleKey]: {
                  ...prevData[sampleKey],
                  [dayKey]: {
                    data: spreadData,
                    color: colorMapping[sampleKey][sampleDayObject.dayIndex]
                  },
                },
              }));
            })
            .catch((error) => console.error('Error fetching data:', error));
        }
      });
    });
  }, [dataMaps, colorMapping]);

  useEffect(() => {
    Object.entries(chartsData).forEach(([sampleKey, sampleObject], sampleIndex) => {
      const canvasId = `${sampleKey}-${sampleIndex}`;
      if (!canvasRefs.current[canvasId]) return;

      const context = canvasRefs.current[canvasId].getContext('2d');

      if (canvasRefs.current[canvasId].chart) {
        canvasRefs.current[canvasId].chart.destroy();
      }

      const labels = sampleObject['4D']?.data.map(item => item.branchIndex) || [];
      const datasets = Object.entries(sampleObject).map(([dayKey, dayData]) => {
        if (!dayData || !dayData.data) return null;
        return {
          label: `${sampleKey} - ${dayKey}`,
          data: dayData.data.map(item => item.branchSpread),
          backgroundColor: dayData.color,
        };
      }).filter(Boolean); // Remove null values

      const chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true, // Show the legend
            },
          },
        },
      });

      canvasRefs.current[canvasId].chart = chart;
    });
  }, [chartsData]);

  return (
    <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {Object.keys(chartsData).map((sampleKey, index) => (
        <div key={sampleKey} style={{ display: 'inline-block', width: '600px', height: '400px', marginRight: '10px' }}>
          <canvas ref={el => canvasRefs.current[`${sampleKey}-${index}`] = el} className={styles.spreadOfBranchesGraph}></canvas>
        </div>
      ))}
    </div>
  );
};

export default SpreadOfBranchesGraph;
