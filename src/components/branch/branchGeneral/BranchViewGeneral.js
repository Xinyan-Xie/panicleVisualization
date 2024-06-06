import styles from '../../../styles/branch/branchGeneral/BranchViewGeneral.module.css';
import HeightPlot from './HeightPlot';
import SpreadHistPlot from './SpreadHistPlot';
import React, { useEffect, useState } from 'react';


// Function to get values of keys from branch_0 to branch_11
function transformDataForBranchGeneral(jsonData) {
  let branchGeneralHeight = [];
  let branchGeneralSpread = [];
  const numBranch = jsonData["panicle"]["noTopSeeds"];
  
  for (let i = 0; i < numBranch; i++) {
    let key = `branchInd_${i}`;
    branchGeneralHeight.push(jsonData["branch"][key]["branchHeight"]);
    branchGeneralSpread.push(jsonData["branch"][key]["branchSpread"]);
  }
  return {branchGeneralHeight, branchGeneralSpread};
}

const BranchViewGeneral = ({ dataMaps }) => {

  const [branchGeneralData, setBranchGeneralData] = useState({});  

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
                setBranchGeneralData(prevData => ({
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
                    "sampleIndex": dataMaps[sampleKey]["10D"]["sampleIndex"],
                    "branchHeight": {"4D": [], "7D": [], "10D": []},
                    "branchSpread": {"4D": [], "7D": [], "10D": []},
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
                    const { branchGeneralHeight, branchGeneralSpread } = transformDataForBranchGeneral(data);
                    setBranchGeneralData(prevData => ({
                      ...prevData,
                      [sampleKey]: {
                        ...prevData[sampleKey],
                        "branchHeight": {
                          ...prevData[sampleKey]["branchHeight"],
                          [dayKey]: branchGeneralHeight},
                        "branchSpread": {
                          ...prevData[sampleKey]["branchSpread"],
                          [dayKey]: branchGeneralSpread},
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
    <div className={styles.branchViewGeneral}>
      <div className={styles.branchSpread}>
        <div className={styles.branchSpreadName}> 
          Branch Spread
        </div>
        <SpreadHistPlot branchGeneralData={branchGeneralData}/>
      </div>

      <div className={styles.branchHeight}>
        <div className={styles.branchHeightName}> Branch Height </div>
        <HeightPlot branchGeneralData={branchGeneralData} />
      </div>
    </div>
  );
};

export default BranchViewGeneral;
