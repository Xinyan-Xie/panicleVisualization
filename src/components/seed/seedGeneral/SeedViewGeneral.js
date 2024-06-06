import styles from '../../../styles/seed/seedGeneral/SeedViewGeneral.module.css';
import VectorChartPlot from './VectorChartPlot';
import React, { useEffect, useState } from 'react';


// Function to get values of keys from branch_0 to branch_11
function transformDataForSeedGeneral(jsonData) {
  let seedPos = [];
  const numTopSeed = jsonData["panicle"]["noTopSeeds"];
  
  for (let i = 0; i < numTopSeed; i++) {
    let key = `TopSeedInd_${i}`;
    seedPos.push([(jsonData["topSeeds"][key]["topSeedPos"][0] - jsonData["panicle"]["basePos"][0]) * 2.5, 
                  (jsonData["topSeeds"][key]["topSeedPos"][1] - jsonData["panicle"]["basePos"][1]) * 2.5]);
  }
  return seedPos;
}

const SeedViewGeneral = ({ dataMaps }) => {

  const [seedGeneralData, setSeedGeneralData] = useState({
    "trtMap": dataMaps["trtMap"],
    "genoMap": dataMaps["genoMap"],
  });  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises  = [];
        for (const [sampleKey, sampleObject] of Object.entries(dataMaps)) {
        // Object.entries(dataMaps).forEach(([sampleKey, sampleObject])  => {
          if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
            
            const connectionFetch = fetch(`/data/summaryFeature/branchesConnection.json`)
              .then(response => response.json())
              .then(data => {
                setSeedGeneralData(prevData => ({
                  ...prevData,
                  [sampleKey]: {
                    "numOfBranchesDay10": data[sampleKey]["numOfBranchesDay10"],
                    "branchesConnection": [
                      data[sampleKey]["4D"], 
                      data[sampleKey]["7D"],
                      data[sampleKey]["10D"],
                      ],
                    "colors": [dataMaps[sampleKey]["4D"]["color"],
                      dataMaps[sampleKey]["7D"]["color"],
                      dataMaps[sampleKey]["10D"]["color"]],
                    "genoIndex": dataMaps[sampleKey]["10D"]["genoIndex"],
                    "treatIndex": dataMaps[sampleKey]["10D"]["treatIndex"],
                    "seedPos": {"4D": [], "7D": [], "10D": []},
                  }        
                }));
              }) 
              .catch(error => console.error('Error fetching connection data:', error));
            fetchPromises.push(connectionFetch);
            // Object.entries(sampleObject).forEach(([dayKey, sampleDayObject])  => {
            
            
            for (const [dayKey, sampleDayObject] of Object.entries(sampleObject)) {
              
              if (sampleDayObject.link) {
                const summaryFetch = fetch(`/data/summaryFeature/${sampleDayObject.link}`)
                  .then(response => response.json())
                  .then(data => {
                    const seedPos = transformDataForSeedGeneral(data);
                    setSeedGeneralData(prevData => ({
                      ...prevData,
                      [sampleKey]: {
                        ...prevData[sampleKey],
                        "seedPos": {
                          ...prevData[sampleKey]["seedPos"],
                          [dayKey]: seedPos},
                      }          
                    }));
                  }) 
                  .catch(error => console.error('Error fetching summary feature data:', error));
                fetchPromises.push(summaryFetch);
              }
            }
          }
          await Promise.all(fetchPromises);
        } 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dataMaps]);
  // });


  return (
    <div className={styles.seedViewGeneral}>
      <div className={styles.seedVector}>
        <div className={styles.seedVectorName}> 
          Seed Vector
        </div>
        <VectorChartPlot seedGeneralData={seedGeneralData}/>
      </div>
    </div>
  );
};

export default SeedViewGeneral;
