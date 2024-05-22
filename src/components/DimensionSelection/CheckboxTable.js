import React, { useState } from 'react';
import styles from '../../styles/DimensionSelection/CheckboxTable.module.css'

const CheckboxTable = ({ onFetchChartData }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    genotype: [],
    treatment: [],
    time: []
  });

  const options = {
    genotype: ['KIT', 'HO1', 'HO2', 'HC2', 'HC5'],
    treatment: ['Control', 'HDNT'],
    time: ['D4', 'D7', 'D10']
  };

  const filenameMap = {
    Control: 'C',
    HDNT: 'H',
    D4: '4D',
    D7: '7D',
    D10: '10D'
  };

  const handleCheckboxChange = (category, value) => {
    const current = selectedOptions[category];
    const newSelection = current.includes(value) ?
      current.filter(item => item !== value) : [...current, value];
    setSelectedOptions({ ...selectedOptions, [category]: newSelection });
  };

  const handleOkClick = () => {
    if (selectedOptions.genotype.length && selectedOptions.treatment.length && selectedOptions.time.length) {
      selectedOptions.genotype.forEach(genotype => {
        selectedOptions.treatment.forEach(treatment => {
          selectedOptions.time.forEach(time => {
            const filename = `${genotype}_${filenameMap[treatment]}_${filenameMap[time]}_Info.json`;
            onFetchChartData(filename);
          });
        });
      });
    } else {
      alert('Please select at least one option from each category.');
    }
    console.log()
  };

  const handleClearClick  = () => {
    setSelectedOptions({genotype: [], treatment: [], time: []});
    window.location.reload();
  };

  return (
    <div className={styles.dimensionContent}>
      {Object.keys(options).map(category => (

        <div key={category} className={styles.checkboxWithDimName}>
          
          <div className={styles.dimName}>
            <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
          </div>

          <div className={styles.checkboxWithLabel}>
            <table>
              <tbody>
                <tr>
                  {options[category].map(item => (
                    <td key={item} className={styles.checkboxEachBoxLabel}>
                      
                      <div className={styles.checkboxEachBox}>
                        <label>
                          <input
                            type="checkbox"
                            name={item}
                            checked={selectedOptions[category].includes(item)}
                            onChange={() => handleCheckboxChange(category, item)}
                          />
                        </label>
                      </div>
                      
                      <div className={styles.checkboxEachLabel}>
                        {item}
                      </div>

                    </td>
                  ))}

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <button onClick={handleOkClick} className={styles.buttons}>
        OK
      </button>

      <button onClick={handleClearClick} className={styles.buttons}>
        Clear
      </button>
      
    </div>
  );
};

export default CheckboxTable;
