import styles from '../../../styles/seed/seedDay10/SeedDay10.module.css';
import BranchDay10PCSelectionView from './BranchDay10PCSelectionView';
import React, { useEffect, useState } from 'react';


const SeedDay10 = ({ dataMaps }) => {

  const [chartsBranchData, setChartsBranchData] = useState({});  
  useEffect(() => {
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject])  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        Object.entries(sampleObject).forEach(([dayKey, sampleDayObject])  => {
          if (dayKey === "10D" && sampleDayObject.link) {
            fetch(`/data/summaryFeature/${sampleDayObject.link}`)
            .then(response => response.json())
            .then(data => {
              setChartsBranchData(prevData => ({
                ...prevData, 
                [sampleKey]: {...dataMaps[sampleKey]["10D"],
                              "noSeedList": data["branch10Day"]["noSeedList"],
                              "numBranches": data["panicle"]["noTopSeeds"]
                            }
              }));
            })
            .catch(error => console.error('Error fetching data:', error));
          } 
        });
      }
    });
  }, [dataMaps]);
  // });



  return (
    <div className={styles.dayTenView}>
      <div className={styles.dayTenViewName}> Day 10 View </div>
      <div className={styles.dayTenOutline}>
        {Object.keys(chartsBranchData).map((sampleKey, index)  => {
          return (
            <div key={index} className={styles.DayTenViewIndividual}>
              <BranchDay10PCSelectionView chartsBranchDataSample={chartsBranchData[sampleKey]} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeedDay10;
