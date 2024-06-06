import styles from '../../styles/branch/BranchView.module.css';
import React, { useEffect, useState } from 'react';
import BranchViewGeneral from './branchGeneral/BranchViewGeneral';
import BranchDay10 from './branchDay10/BranchDay10';

const BranchView = ({ dataMaps, equations }) => {

  return (
    <div className={styles.branchView}>
      <h2 className={styles.branchTitle}>Branch View</h2>
      <BranchViewGeneral dataMaps={dataMaps} />
      <BranchDay10 dataMaps={dataMaps} equations={equations} />
    </div>


  );
};

export default BranchView;
