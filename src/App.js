import React, { useState } from 'react';
import DimensionSelection from './components/DimensionSelection/DimensionSelection';
import SegmentView from './components/unused/SegmentView';
import SegmentViewMap from './components/segment/SegmentViewMap';
import BranchView from './components/branch/BranchView';
import './App.css';

function App() {

  const colorMapping = {
    'KIT x HDNT':  ['#FF6347', '#FF2400', '#B21800'],
    'KIT x CONTROL': ['#6699CC', '#0047AB', '#002D6F'],
    'HC5 x HDNT': ['#80D641', '#4CBB17', '#347C0E'],
    'HC5 x CONTROL': ['#FFD700', '#FFBF00', '#B18904'],
    'HO1 x HDNT': ['#D783FF', '#8F00FF', '#5C00CC'],
    'HO1 x CONTROL': ['#8FEBEB', '#40E0D0', '#287C7D'],
    'HO2 x HDNT': ['#FFA785', '#FF7F50', '#CC3C1E'],
    'HO2 x CONTROL': ['#A2B3BF', '#708090', '#4C606D'],
    'HC2 x HDNT': ['#FF66FF', '#FF00FF', '#B300B3'],
    'HC2 x CONTROL': ['#B3B300', '#808000', '#505000'],
  };

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

  // const [dataMaps, setdataMaps] = useState({numIndex: 0});
  const [dataMaps, setdataMaps] = useState({numIndex: 0, 
                                            genoMap: {count :0}, 
                                            trtMap: {count :0}});

  // let index = -1;
  const fetchChartData = (filename) => {
   
    // console.log("fetchChartData, ", filename)
    let parts = filename.split('_');
    let genotype = parts[0];
    let treatment = parts[1] === 'H' ? 'HDNT' : 'CONTROL';
    let genoTrtComb = `${genotype} x ${treatment}`;
    let timeSeq = parts[2];
    
    let indexGeno;
    if (genotype === "KIT") {
      indexGeno = 'KIT';
    } else if (genotype === "HO1") {
      indexGeno = 'HO1';
    } else if (genotype === "HO2") {
      indexGeno = 'HO2';
    } else if (genotype === "HC2") {
      indexGeno = 'HC2';
    } else if (genotype === "HC5") {
      indexGeno = 'HC5';
    } else {
      indexGeno = 5;
    }
    if (genotype === "KIT") {
      indexGeno = 0;
    } else if (genotype === "HO1") {
      indexGeno = 1;
    } else if (genotype === "HO2") {
      indexGeno = 2;
    } else if (genotype === "HC2") {
      indexGeno = 3;
    } else if (genotype === "HC5") {
      indexGeno = 4;
    } else {
      indexGeno = 5;
    }
    
    
    let indexTrt;
    if (treatment === "CONTROL") {
      indexTrt = 'CONTROL';
    } else if (treatment === "HDNT") {
      indexTrt = 'HDNT';
    } else {
      indexTrt = 2;
    }
    if (treatment === "CONTROL") {
      indexTrt = 0;
    } else if (treatment === "HDNT") {
      indexTrt = 1;
    } else {
      indexTrt = 2;
    }

    let indexTime;
    if (timeSeq === "4D") {
      indexTime = 0;
    } else if (timeSeq === "7D") {
      indexTime = 1;
    } else {
      indexTime = 2;
    }

    
    setdataMaps(prevdataMaps => {
      const newdataMaps = { ...prevdataMaps };
      if (!(genoTrtComb in newdataMaps)) {
        newdataMaps["numIndex"] = prevdataMaps["numIndex"] + 1;
        
        if (!(genotype in newdataMaps["genoMap"])) {
          newdataMaps["genoMap"][genotype] = newdataMaps["genoMap"]['count'];
          newdataMaps["genoMap"]['count'] = newdataMaps["genoMap"]['count'] + 1;
        }

        if (!(treatment in newdataMaps["trtMap"])) {
          newdataMaps["trtMap"][treatment] = newdataMaps["trtMap"]['count'];
          newdataMaps["trtMap"]['count'] = newdataMaps["trtMap"]['count'] + 1;
        }

        newdataMaps[genoTrtComb] = {
          '4D': {sampleIndex: prevdataMaps["numIndex"], 
                 genoIndex: newdataMaps["genoMap"][genotype],
                 treatIndex: newdataMaps["trtMap"][treatment],
                //  genoIndex: indexGeno,
                //  treatIndex: indexTrt,
                 dayIndex: 0,
                 color: colorMapping[genoTrtComb][0]}, 
          '7D': {sampleIndex: prevdataMaps["numIndex"], 
                 genoIndex: newdataMaps["genoMap"][genotype],
                 treatIndex: newdataMaps["trtMap"][treatment],
                //  genoIndex: indexGeno,
                //  treatIndex: indexTrt,
                 dayIndex: 1,
                 color: colorMapping[genoTrtComb][1]}, 
          '10D': {sampleIndex: prevdataMaps["numIndex"], 
                 genoIndex: newdataMaps["genoMap"][genotype],
                 treatIndex: newdataMaps["trtMap"][treatment],
                //  genoIndex: indexGeno,
                //  treatIndex: indexTrt,
                 dayIndex: 2,
                 color: colorMapping[genoTrtComb][2]}
        };
      } 
      newdataMaps[genoTrtComb][timeSeq] = {
        ...newdataMaps[genoTrtComb][timeSeq],
        link: filename,
        time: timeSeq,
        // color: colorMapping[genoTrtComb][indexTime]
      };
      return newdataMaps;
    });
  };

  return (
    <div className="App">
      <DimensionSelection onFetchChartData={fetchChartData} />
      <SegmentViewMap dataMaps={dataMaps} />
      <BranchView dataMaps={dataMaps}/>
    </div>
  );
}

export default App;
