import styles from '../../../styles/branch/branchGeneral/BranchViewGeneral.module.css';
import HeightPlot from './HeightPlot';
import SpreadHistPlot from './SpreadHistPlot';
import React, { useEffect, useState } from 'react';

// Function to get values of keys from branch_0 to branch_11
function transformDataForBranchGeneral(jsonData) {
  let branchGeneralHeight = [];
  let branchGeneralSpread = [];
  const numBranch = jsonData.panicle.noTopSeeds;

  for (let i = 0; i < numBranch; i++) {
    let key = `branchInd_${i}`;
    branchGeneralHeight.push(jsonData.branch[key].branchHeight);
    branchGeneralSpread.push(jsonData.branch[key].branchSpread);
  }
  return { branchGeneralHeight, branchGeneralSpread };
}

const BranchViewGeneral = ({ dataMaps }) => {
  const [branchGeneralData, setBranchGeneralData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = [];
        const updatedData = {};

        for (const [sampleKey, sampleObject] of Object.entries(dataMaps)) {
          if (sampleKey !== 'numIndex' && sampleKey !== 'genoMap' && sampleKey !== 'trtMap') {
            const connectionFetch = fetch(`/data/summaryFeature/branchesConnection.json`)
              .then(response => response.json())
              .then(data => {
                updatedData[sampleKey] = {
                  numOfBranchesDay10: data[sampleKey].numOfBranchesDay10,
                  branchesConnection: [data[sampleKey]['4D'], data[sampleKey]['7D'], data[sampleKey]['10D']],
                  colors: [
                    dataMaps[sampleKey]['4D'].color,
                    dataMaps[sampleKey]['7D'].color,
                    dataMaps[sampleKey]['10D'].color,
                  ],
                  sampleIndex: dataMaps[sampleKey]['10D'].sampleIndex,
                  branchHeight: { '4D': [], '7D': [], '10D': [] },
                  branchSpread: { '4D': [], '7D': [], '10D': [] },
                };
              })
              .catch(error => console.error('Error fetching connection data:', error));
            fetchPromises.push(connectionFetch);

            for (const [dayKey, sampleDayObject] of Object.entries(sampleObject)) {
              if (sampleDayObject.link) {
                const summaryFetch = fetch(`/data/summaryFeature/${sampleDayObject.link}`)
                  .then(response => response.json())
                  .then(data => {
                    const { branchGeneralHeight, branchGeneralSpread } = transformDataForBranchGeneral(data);
                    if (updatedData[sampleKey]) {
                      updatedData[sampleKey].branchHeight[dayKey] = branchGeneralHeight;
                      updatedData[sampleKey].branchSpread[dayKey] = branchGeneralSpread;
                    }
                  })
                  .catch(error => console.error('Error fetching summary feature data:', error));
                fetchPromises.push(summaryFetch);
              }
            }
          }
        }

        await Promise.all(fetchPromises);
        setBranchGeneralData(updatedData);
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataMaps]);

  if (!dataFetched) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  return (
    <div className={styles.branchViewGeneral}>
      <div className={styles.branchSpread}>
        <div className={styles.branchSpreadName}>Branch Spread</div>
        <SpreadHistPlot branchGeneralData={branchGeneralData} />
      </div>

      <div className={styles.branchHeight}>
        <div className={styles.branchHeightName}>Branch Height</div>
        <HeightPlot branchGeneralData={branchGeneralData} />
      </div>
    </div>
  );
};

export default BranchViewGeneral;
