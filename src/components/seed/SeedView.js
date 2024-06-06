import styles from '../../styles/seed/SeedView.module.css';
import React, { useEffect, useState } from 'react';
import SeedViewGeneral from './seedGeneral/SeedViewGeneral';
import SeedDay10 from './seedDay10/SeedDay10';

const SeedView = ({ dataMaps, equations }) => {

  return (
    <div className={styles.seedView}>
      <h2 className={styles.seedTitle}>Seed View</h2>
      <SeedViewGeneral dataMaps={dataMaps} />
      <SeedDay10 dataMaps={dataMaps} equations={equations} />
    </div>


  );
};

export default SeedView;
