import React, { useEffect, useState } from 'react';
import styles from '../../styles/segment/SegmentView.module.css';
import SegementIndividualRadar from './SegementIndividualRadar';
import SegementIndividualRadarLabel from './SegementIndividualRadarLabel';
import SegementTimeDiff from './SegementTimeDiff';
import SegementGenoDiff from './SegementGenoDiff';
import SegementTrtDiff from './SegementTrtDiff';
import { evaluate } from 'mathjs';

// Function to calculate the user-defined vegetation index
function calculateVegetationIndex(equation, data) {
  const { colAvgR: R, colAvgG: G, colAvgB: B } = data.panicle;
  try {
    return evaluate(equation, { R, G, B });
  } catch (error) {
    console.error('Error evaluating equation:', error);
    return 0;
  }
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForRadarChart(jsonData, equations) {
  const dataForChart = [
    {axis: 'Height', value: jsonData.panicle.height / 300 },
    {axis: 'Volume', value: jsonData.panicle.volume / 10000 },
    {axis: 'Spread', value: jsonData.panicle.maxSpreadVal / 50 },
    {axis: 'Branches', value: jsonData.panicle.noTopSeeds / 20 },
    {axis: 'Vegetation Index 1', value: calculateVegetationIndex(equations.equation1, jsonData) },
    {axis: 'Vegetation Index 2', value: calculateVegetationIndex(equations.equation2, jsonData) },
    {axis: 'Vegetation Index 3', value: calculateVegetationIndex(equations.equation3, jsonData) },
    {axis: 'Vegetation Index 4', value: calculateVegetationIndex(equations.equation4, jsonData) },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForNone() {
  const dataForChart = [
    { axis: 'Height', value: 0 },
    { axis: 'Volume', value: 0 },
    { axis: 'Spread', value: 0 },
    { axis: 'Branches', value: 0 },
    { axis: 'Vegetation Index 1', value: 0 },
    { axis: 'Vegetation Index 2', value: 0 },
    { axis: 'Vegetation Index 3', value: 0 },
    { axis: 'Vegetation Index 4', value: 0 },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}


const SegmentViewMap = ({ dataMaps, equations }) => {
  const [chartsData, setChartsData] = useState(dataMaps);
  const [dataFetched, setDataFetched] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const updatedData = { ...dataMaps, 
        numIndex: dataMaps.numIndex, 
        trtMap: dataMaps.trtMap, 
        genoMap: dataMaps.genoMap };

      await Promise.all(
        Object.entries(dataMaps).map(async ([sampleKey, sampleObject]) => {
          if (sampleKey !== 'numIndex' && sampleKey !== 'genoMap' && sampleKey !== 'trtMap') {
            await Promise.all(
              Object.entries(sampleObject).map(async ([dayKey, sampleDayObject]) => {
                if (sampleDayObject.link) {
                  try {
                    const response = await fetch(`/data/summaryFeature/${sampleDayObject.link}`);
                    const data = await response.json();
                    const radarData = transformDataForRadarChart(data, equations);
                    updatedData[sampleKey] = {
                      ...updatedData[sampleKey],
                      [dayKey]: {
                        genoIndex: sampleDayObject.genoIndex,
                        treatIndex: sampleDayObject.treatIndex,
                        sampleIndex: sampleDayObject.sampleIndex,
                        dayIndex: sampleDayObject.dayIndex,
                        color: sampleDayObject.color,
                        data: radarData,
                      },
                    };
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
                } else {
                  const radarData = transformDataForNone(equations);
                  updatedData[sampleKey] = {
                    ...updatedData[sampleKey],
                    [dayKey]: {
                      genoIndex: sampleDayObject.genoIndex,
                      treatIndex: sampleDayObject.treatIndex,
                      sampleIndex: sampleDayObject.sampleIndex,
                      dayIndex: sampleDayObject.dayIndex,
                      color: sampleDayObject.color,
                      data: radarData,
                    },
                  };
                }
              })
            );
          }
        })
      );

      setChartsData(updatedData);
      setDataFetched(true);
    };

    fetchData();
  }, [dataMaps, equations]);

  if (!dataFetched) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  return (
    <div className={styles.segmentView}>

      <h2 className={styles.segmentTitle}>Segment View</h2>
      <div className={styles.segmentIndividualTimeDiff}>
        <div className={styles.segmentIndividualLabel}>
          <div className={styles.segmentIndividualLabelBlankName}> 
            Label  
          </div>
          <SegementIndividualRadarLabel chartsData={chartsData} />          
        </div>
        
        <div className={styles.segmentIndividual}>
          <div className={styles.segmentIndividualName}> 
            Individual Sample  
          </div>
          <SegementIndividualRadar chartsData={chartsData} />          
        </div>

        <div className={styles.segmentTimeDiff} >
          <div className={styles.segmentTimeDiffName}> 
            TIME DIFF
          </div>
          <SegementTimeDiff chartsData={chartsData} />
        </div>
        
      </div>
      <div className={styles.segmentTrtDiff}>
        <div className={styles.segmentTrtDiffName}> 
          TREATMENT DIFF
        </div>
        <SegementTrtDiff chartsData={chartsData} />
      </div>

      <div className={styles.segmentGenoDiff}>
        <div className={styles.segmentGenoDiffName}> 
          GENOTYPE DIFF
        </div>
        <SegementGenoDiff chartsData={chartsData} />
      </div>
      
    </div>
  );
};

export default SegmentViewMap;
