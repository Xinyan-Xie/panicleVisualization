import React, { useState, useEffect } from 'react';
import styles from '../../styles/DimensionSelection/VegetationIndexInputs.module.css';

const VegetationIndexInputs = ({ onEquationChange, equations }) => {
  const [inputs, setInputs] = useState(equations);

  useEffect(() => {
    setInputs(equations);
  }, [equations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    onEquationChange(name, value);
  };

  return (
    <div className={styles.vegIndexcontainer}>
      <div className={styles.vegIndexcontainerLabel}>
        User-defined Vegetation Index
      </div>
      <div className={styles.inputGroup}>
        <div>
          <input
            type="text"
            name="equation1"
            value={inputs.equation1}
            placeholder="Equation 1"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="equation2"
            value={inputs.equation2}
            placeholder="Equation 2"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="equation3"
            value={inputs.equation3}
            placeholder="Equation 3"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="equation4"
            value={inputs.equation4}
            placeholder="Equation 4"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VegetationIndexInputs;
