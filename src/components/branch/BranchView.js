import styles from '../../styles/branch/BranchView.module.css';
import HeightGraph from './branchGeneral/HeightGraph';
import SpreadOfBranchesGraph from './branchGeneral/SpreadOfBranchesGraph';
import BranchDay10 from './branchDay10/BranchDay10';
import React, { useEffect, useState } from 'react';

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForDay10Graph(jsonData) {
  console.log("jsonData.panicle.noTopSeeds, ", jsonData.panicle.noTopSeeds)
  let nodes = [];
  let links = [];
  let lastBranchId = 'branch_0_end';

  let basePoint = {
    "id": "plantBasePoint", 
    "name": "plantBasePoint",
    "color": "darkgrey",
    "x": (jsonData["panicle"]["basePos"][0] - 10) * 1.5,
    "y": (0 - 100) * 1.5,
    "z": (jsonData["panicle"]["basePos"][1]) * 1.5};
  nodes.push(basePoint);


  for (let i = 0; i < jsonData.panicle.noTopSeeds; i++) {
    let branchTopId = 'branch_' + i;
    let eachBranchTop = {
      "id": branchTopId + '_top', 
      "name": branchTopId,
      "color": "orange",
      "x": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][0] - 10) * 1.5,
      "y": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][2] - 100) * 1.5,
      "z": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][1])  * 1.5};
    nodes.push(eachBranchTop);
    let branchEndId = 'branch_' + i;
    let eachBranchEnd = {
      "id": branchEndId + '_end', 
      "name": branchEndId,
      "color": "orange",
      "x": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][0] - 10) * 1.5,
      "y": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][2] - 100) *1.5,
      "z": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][1]) * 1.5};
    nodes.push(eachBranchEnd);
    // console.log("eachBranchTop, ", eachBranchTop)
    let branch = {
      "source": branchEndId + '_top',
      "target": branchEndId + '_end',
      "color": "darkgrey"
    }
    links.push(branch);

    let stem;
    if (i === 0) {
      stem = {
        "source": lastBranchId,
        "target": 'plantBasePoint',
        "color": "darkgrey"
      }
    } else {
      stem = {
        "source": lastBranchId,
        "target": branchEndId + '_end',
        "color": "darkgrey"
      }
    }
    links.push(stem);
    
    lastBranchId = branchEndId + '_end';
    
  }

  let day10Graph = { nodes, links };
  console.log("day10Graph, ", day10Graph)
  return day10Graph;
}



const BranchView = ({ dataMaps }) => {

  // const [chartsBranchData, setChartsBranchData] = useState(dataMaps);
  const [chartsBranchData, setChartsBranchData] = useState({});
  
  useEffect(() => {
    console.log("     dataMaps. ", dataMaps)
    // setChartsBranchData(prevData => ({...prevData, 
    //                                   numIndex: 0}));
    // setChartsBranchData(prevData => ({...prevData, 
    //                                   numIndex: dataMaps["numIndex"]}));
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject])  => {
      // setChartsBranchData(prevData => ({...prevData}));
      Object.entries(sampleObject).forEach(([dayKey, sampleDayObject])  => {
        console.log("sampleKey, dayKey, ", sampleKey, dayKey)
        if (dayKey === "10D" && sampleDayObject.link) {
          fetch(`/data/summaryFeature/${sampleDayObject.link}`)
          .then(response => response.json())
          .then(data => {

            let day10GraphData = transformDataForDay10Graph(data);
            // setChartsBranchData(day10GraphData);

            setChartsBranchData(prevData => ({
              ...prevData, 
              [sampleKey]: {...dataMaps[sampleKey]["10D"],
                            "data": day10GraphData,
                            "numBranches": data["panicle"]["noTopSeeds"]}
            }));
          })
          .catch(error => console.error('Error fetching data:', error));
        } 
      });
    });
  }, [dataMaps]);
  // });



  return (
    <div className={styles.branchView}>
      <h2 className={styles.branchTitle}>Branch View</h2>
      <div className={styles.branchHeight}>
        <div className={styles.branchHeightName}> Branch Height </div>
        <div className={styles.branchHeightPlot}>
          {/* <HeightGraph dataMaps={dataMaps} colorMapping={colorMapping} /> */}
        </div>
      </div>

      <div className={styles.branchSpread}>
        <div className={styles.branchSpreadName}> 
          Branch Spread
        </div>
        <div className={styles.branchSpreadPlot}>
          {/* {spreadRedData.labels.length > 0 && ( */}
          {/* // <SpreadOfBranchesGraph dataMaps={dataMaps} colorMapping={colorMapping} />)} */}
        </div>
      </div>

      <div className={styles.dayTenView}>
        <div className={styles.dayTenViewName}> 
          Day 10 View
        </div>
        <BranchDay10 chartsBranchData={chartsBranchData}/>
      </div>

      {/* Insert additional components for the branch view */}
    </div>
  );
};

export default BranchView;
