import { evaluate } from 'mathjs';
import React, { useEffect, useState } from 'react';
import BranchDay10ForceGraph3D from './BranchDay10ForceGraph3D';
import styles from '../../../styles/branch/branchDay10/BranchDay10.module.css';

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForDay10Graph(jsonData, sampleDayObject) {
  let nodes = [];
  let links = [];
  let lastBranchId = 'branch_0_end';

  let basePoint = {
    "id": "plantBasePoint", 
    "name": "plantBasePoint",
    "color": "darkgrey",
    // "x": (jsonData["panicle"]["basePos"][0] - 10) * 1.5,
    // "y": (0 - 100) * 1.5,
    // "z": (jsonData["panicle"]["basePos"][1]) * 1.5};
    "x": 0,
    "y": 0 - 180,
    "z": 0};
  nodes.push(basePoint);


  for (let i = 0; i < jsonData.panicle.noTopSeeds; i++) {
    let branchTopId = 'branch_' + i;
    let eachBranchTop = {
      "id": branchTopId + '_top', 
      "name": branchTopId,
      "color": sampleDayObject["color"],
      // "x": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][0] - 10) * 1.5,
      // "y": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][2] - 100) * 1.5,
      // "z": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][1])  * 1.5};
      "x": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][0]) * 1.8,
      "y": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][2]) * 1.8 - 180,
      "z": (jsonData["branch10Day"]["branchInd_" + i]["branchUpperPos"][1]) * 1.8};
    nodes.push(eachBranchTop);
    let branchEndId = 'branch_' + i;
    let eachBranchEnd = {
      "id": branchEndId + '_end', 
      "name": branchEndId,
      "color": sampleDayObject["color"],
      "x": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][0]) * 1.8,
      "y": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][2]) * 1.8 - 180,
      "z": (jsonData["branch10Day"]["branchInd_" + i]["branchLowerPos"][1]) * 1.8};
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
  return day10Graph;
}

// Function to calculate the user-defined vegetation index
function calculateVegetationIndex(equation, data) {
  const { branchAverageR: R, branchAverageG: G, branchAverageB: B } = data;
  try {
    return evaluate(equation, { R, G, B });
  } catch (error) {
    console.error('Error evaluating equation:', error);
    return 0;
  }
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformDataForDay10Radar(jsonData, sampleDayObject, equations) {
  let radarData  = {};
  for (let i = 0; i < jsonData.panicle.noTopSeeds; i++) {
    let branchTopId = 'branch_' + i;
    radarData[branchTopId] = [[
      {axis: "volumeBranch", value: jsonData["branch10Day"]["branchInd_" + i]["volumeBranch"] / 1000,},
      {axis: "lengthBranch", value: jsonData["branch10Day"]["branchInd_" + i]["lengthBranch"] / 300, },
      {axis: "angleBranch", value: jsonData["branch10Day"]["branchInd_" + i]["angleBranch"] / 45, },
      {axis: "noSeed", value: jsonData.panicle.noTopSeeds / 20, },
      {axis: "branchAverageR", value: calculateVegetationIndex(equations.equation1, jsonData["branch10Day"]["branchInd_" + i]), },
      {axis: "branchAverageG", value: calculateVegetationIndex(equations.equation2, jsonData["branch10Day"]["branchInd_" + i]), },
      {axis: "branchAverageB", value: calculateVegetationIndex(equations.equation3, jsonData["branch10Day"]["branchInd_" + i]), },
      {axis: "branchAverageBB",value: calculateVegetationIndex(equations.equation4, jsonData["branch10Day"]["branchInd_" + i]), },
      // {axis: "branchAverageR", value: jsonData["branch10Day"]["branchInd_" + i]["branchAverageR"] / 255, },
      // {axis: "branchAverageG", value: jsonData["branch10Day"]["branchInd_" + i]["branchAverageG"] / 255, },
      // {axis: "branchAverageB", value: jsonData["branch10Day"]["branchInd_" + i]["branchAverageB"] / 255, },
      // {axis: "branchAverageBB", value: jsonData["branch10Day"]["branchInd_" + i]["branchAverageB"] / 255, },
    ]]
  }
  return radarData;
}

const BranchDay10 = ({ dataMaps, equations }) => {

  const [chartsBranchData, setChartsBranchData] = useState({});  
  useEffect(() => {
    Object.entries(dataMaps).forEach(([sampleKey, sampleObject])  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        Object.entries(sampleObject).forEach(([dayKey, sampleDayObject])  => {
          if (dayKey === "10D" && sampleDayObject.link) {
            fetch(`/data/summaryFeature/${sampleDayObject.link}`)
            .then(response => response.json())
            .then(data => {

              let day10GraphData = transformDataForDay10Graph(data, sampleDayObject);
              let day10RadarData = transformDataForDay10Radar(data, sampleDayObject, equations);
              // setChartsBranchData(day10GraphData);
              setChartsBranchData(prevData => ({
                ...prevData, 
                [sampleKey]: {...dataMaps[sampleKey]["10D"],
                              "data": day10GraphData,
                              "radarData": day10RadarData,
                              "numBranches": data["panicle"]["noTopSeeds"]
                            }
              }));
            })
            .catch(error => console.error('Error fetching data:', error));
          } 
        });
      }
    });
  }, [dataMaps, equations]);
  // });



  return (
    <div className={styles.dayTenView}>
      <div className={styles.dayTenViewName}> Day 10 View </div>
      <BranchDay10ForceGraph3D chartsBranchData={chartsBranchData}/>
    </div>
  );
};

export default BranchDay10;
