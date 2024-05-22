import React, { useEffect, useState } from 'react';
import styles from '../../styles/segment/SegmentView.module.css';
import SegementIndividualRadar from './SegementIndividualRadar';
import SegementIndividualRadarLabel from './SegementIndividualRadarLabel';
import SegementTimeDiff from './SegementTimeDiff';
import SegementGenoDiff from './SegementGenoDiff';
import SegementTrtDiff from './SegementTrtDiff';


// Function to calculate the user-defined vegetation index
function calculateVegetationIndex(data) {
  // Placeholder function for your vegetation index calculation
  return 0.5; // Example static value, adjust based on your actual calculation
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForRadarChart(jsonData) {
  const dataForChart = [
    {axis: "Height", value: jsonData.panicle.height / 300,},
    {axis: "Volume", value: jsonData.panicle.volume / 10000, },
    {axis: "Spread", value: jsonData.panicle.maxSpreadVal / 50, },
    // value: Object.keys(jsonData.branch).length / 20,
    {axis: "Branches", value: jsonData.panicle.noTopSeeds / 20, },
    {axis: "Avg Red", value: jsonData.panicle.colAvgR, },
    {axis: "Avg Green", value: jsonData.panicle.colAvgG, },
    {axis: "Avg Blue", value: jsonData.panicle.colAvgB, },
    {axis: "Vegetation Index", value: calculateVegetationIndex(jsonData), },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForNone() {
  const dataForChart = [
    {axis: "Height", value: 0,},
    {axis: "Volume", value: 0, },
    {axis: "Spread", value: 0, },
    // value: Object.keys(jsonData.branch).length / 20,
    {axis: "Branches", value: 0, },
    {axis: "Avg Red", value: 0, },
    {axis: "Avg Green", value: 0, },
    {axis: "Avg Blue", value: 0, },
    {axis: "Vegetation Index", value: 0, },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}


const SegmentViewMap = ({ dataMaps }) => {
  
  const [chartsData, setChartsData] = useState(dataMaps);
  
  useEffect(() => {
    setChartsData(prevData => ({...prevData, 
                                numIndex: dataMaps["numIndex"],
                                trtMap: dataMaps["trtMap"],
                                genoMap: dataMaps["genoMap"]}));
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject])  => {
      setChartsData(prevData => ({...prevData}));
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        Object.entries(sampleObject).forEach(([dayKey, sampleDayObject])  => {
          if (sampleDayObject.link) {
            fetch(`/data/summaryFeature/${sampleDayObject.link}`)
            .then(response => response.json())
            .then(data => {
              let radarData = transformDataForRadarChart(data);
              setChartsData(prevData => ({
                ...prevData,
                [sampleKey]: {
                              ...prevData[sampleKey],
                            [dayKey]: {
                                        // ...prevData[sampleKey][dayKey],
                                        "genoIndex": sampleDayObject["genoIndex"],
                                        "treatIndex": sampleDayObject["treatIndex"],
                                        "sampleIndex": sampleDayObject["sampleIndex"],
                                        "dayIndex": sampleDayObject["dayIndex"],
                                        "color": sampleDayObject["color"],
                                        "data": radarData}
                              }
              }));
            })
            .catch(error => console.error('Error fetching data:', error));
          } else {
            let radarData = transformDataForNone();
            setChartsData(prevData => ({
              ...prevData, 
              [sampleKey]: {
                            ...prevData[sampleKey], 
                            [dayKey]: {
                              "genoIndex": sampleDayObject["genoIndex"],
                              "treatIndex": sampleDayObject["treatIndex"],
                              "sampleIndex": sampleDayObject["sampleIndex"],
                              "dayIndex": sampleDayObject["dayIndex"],
                              "color": sampleDayObject["color"],
                              "data": radarData
              }}
            }));
          }
        });
      }
    });
  }, [dataMaps]);
  // }, []);   
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
