import React, { useState } from 'react';
import DimensionSelection from './components/DimensionSelection/DimensionSelection';
import SegmentViewMap from './components/segment/SegmentViewMap';
import BranchView from './components/branch/BranchView';
import SeedView from './components/seed/SeedView';
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

  const [dataMaps, setdataMaps] = useState({numIndex: 0, 
                                            genoMap: {count :0}, 
                                            trtMap: {count :0}});

  
  const [equations, setEquations] = useState({
    equation1: 'R',
    equation2: 'G',
    equation3: 'B',
    equation4: '(R+G+B)/3',
  });

  const fetchChartData = (filename) => {
   
    let parts = filename.split('_');
    let genotype = parts[0];
    let treatment = parts[1] === 'H' ? 'HDNT' : 'CONTROL';
    let genoTrtComb = `${genotype} x ${treatment}`;
    let timeSeq = parts[2];
    
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
                 dayIndex: 0,
                 color: colorMapping[genoTrtComb][0]}, 
          '7D': {sampleIndex: prevdataMaps["numIndex"], 
                 genoIndex: newdataMaps["genoMap"][genotype],
                 treatIndex: newdataMaps["trtMap"][treatment],
                 dayIndex: 1,
                 color: colorMapping[genoTrtComb][1]}, 
          '10D': {sampleIndex: prevdataMaps["numIndex"], 
                 genoIndex: newdataMaps["genoMap"][genotype],
                 treatIndex: newdataMaps["trtMap"][treatment],
                 dayIndex: 2,
                 color: colorMapping[genoTrtComb][2]}
        };
      } 
      newdataMaps[genoTrtComb][timeSeq] = {
        ...newdataMaps[genoTrtComb][timeSeq],
        link: filename,
      };
      return newdataMaps;
    });
  };

  const handleEquationChange = (name, value) => {
    setEquations((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="App">
      <DimensionSelection 
        onFetchChartData={fetchChartData} 
        equations={equations}
        onEquationChange={handleEquationChange}/>
      <div>
        <SegmentViewMap dataMaps={dataMaps} equations={equations} />
      </div>
      <div>
        <BranchView dataMaps={dataMaps}/>
        <SeedView dataMaps={dataMaps}/>
      </div>
      
    </div>
  );
}

export default App;
