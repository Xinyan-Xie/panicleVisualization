import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HeightGraph = ({ dataMaps, colorMapping }) => {
  const [chartsData, setChartsData] = useState({});

  useEffect(() => {
    console.log(dataMaps);
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject]) => {
      Object.entries(sampleObject).forEach(([dayKey, sampleDayObject]) => {
        if (sampleDayObject.link) {
          fetch(`/data/${sampleDayObject.link}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('Fetched data:', data);
              setChartsData((prevData) => ({
                ...prevData,
                [sampleKey]: {
                  ...prevData[sampleKey],
                  [dayKey]: data,
                },
              }));
            })
            .catch((error) => console.error('Error fetching data:', error));
        }
      });
    });
  }, [dataMaps]);

  const getDatasets = (sampleObject, sampleKey) => {
    const datasets = [];
    const days = ['4D', '7D', '10D'];

    days.forEach((dayKey, dayIndex) => {
      const dayData = sampleObject[dayKey];
      if (dayData && dayData.branch && colorMapping[sampleKey] && colorMapping[sampleKey][dayIndex]) {
        const color = colorMapping[sampleKey][dayIndex];
        const heights = Object.keys(dayData.branch)
          .filter(key => key.startsWith('branchInd_'))
          .map(key => dayData.branch[key].branchHeight);

        const data = heights.map((height) => ({
          x: dayIndex * 10,  // Positioning nodes horizontally based on the day
          y: height,
          backgroundColor: color,
        }));

        datasets.push({
          label: `${sampleKey} - ${dayKey}`,
          data: data,
          backgroundColor: color,
          pointRadius: 5,
          pointHoverRadius: 7,
          showLine: false,
          borderColor: color,
          borderWidth: 1,
          pointStyle: 'circle',
        });

        // Connect nodes between days
        if (dayIndex < days.length - 1) {
          const nextDayKey = days[dayIndex + 1];
          const nextDayData = sampleObject[nextDayKey];
          const nextColor = colorMapping[sampleKey][dayIndex + 1];

          if (nextDayData && nextDayData.branch) {
            const nextHeights = Object.keys(nextDayData.branch)
              .filter(key => key.startsWith('branchInd_'))
              .map(key => nextDayData.branch[key].branchHeight);

            heights.forEach((currentHeight, i) => {
              if (nextHeights[i] !== undefined) {
                const currentNode = {
                  x: dayIndex * 10,
                  y: currentHeight,
                  backgroundColor: color,
                };
                const nextNode = {
                  x: (dayIndex + 1) * 10,
                  y: nextHeights[i],
                  backgroundColor: nextColor,
                };

                datasets.push({
                  label: `Connection ${sampleKey} - ${dayKey} to ${nextDayKey}`,
                  data: [currentNode, nextNode],
                  backgroundColor: nextColor,
                  pointRadius: 0,
                  showLine: true,
                  borderColor: nextColor,
                  borderWidth: 1,
                });
              }
            });
          }
        }
      }
    });

    return datasets;
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Days',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 10,
          callback: (value) => {
            const dayMap = { 0: 'Day 4', 10: 'Day 7', 20: 'Day 10' };
            return dayMap[value] || '';
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Height (cm)',
        },
        ticks: {
          callback: (value) => `${value} cm`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      title: {
        display: false,  // Disable the chart title
        text: 'Height Graph',
      },
      legend: {
        display: false,  // Disable the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `(${context.raw.x.toFixed(2)}, ${context.raw.y.toFixed(2)} cm)`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    backgroundColor: 'rgba(192, 192, 192, 0.3)',
  };

  return (
    <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {Object.entries(chartsData).map(([sampleKey, sampleObject], index) => (
        <div key={index} style={{ display: 'inline-block', width: '300px', height: '500px', marginRight: '10px' }}>
          <Scatter data={{ datasets: getDatasets(sampleObject, sampleKey) }} options={chartOptions} />
        </div>
      ))}
    </div>
  );
};

export default HeightGraph;
