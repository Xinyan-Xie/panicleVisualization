import React from 'react';
import styles from '../../styles/DimensionSelection/DimensionColorMapping.module.css'

// Mapping from genotype x treatment combinations to colors
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


// List of days for the headers
const days = ['Day 4', 'Day 7', 'Day 10'];

const DimensionColorMapping = () => {
  // Generate an array of genotype x treatment combinations
  const combinations = Object.keys(colorMapping);

  return (
    
    <div className={styles.dimensionColorTableOutline}>
      <table className={styles.dimensionColorTable}>
        <thead>
          <tr>
            <th className={styles.dimensionTableHeadName} ></th>
            {days.map(day => <th key={day} className={styles.dimensionTableHeadText}>{day}</th>)}
          </tr>
        </thead>
        <tr className={styles.lineSpace}></tr>
        <tbody>
          {combinations.map(combination => (
            <tr key={combination}>
              <td className={styles.dimensionColorCubeName}>
                {combination}
              </td>
              {days.map((day, index) => (
                <td key={day} className={styles.dimensionColorCubeBox}>
                  <div className={styles.dimensionColorCube}
                    style = {{backgroundColor: colorMapping[combination][index]}}>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default DimensionColorMapping;
