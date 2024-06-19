import React, { useState, useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import styles from '../../../styles/seed/seedDay10/BranchSeedDay10ForceGraph3D.module.css';

const BranchSeedDay10ForceGraph3D = ( {points} ) => {

  useEffect(() => { 
    console.log(points);
  });

  return (
    <div className={styles.dayTenOutline}>


      <ForceGraph3D
        graphData={points}
        nodeAutoColorBy="color"
        linkDirectionalParticles="value"
        // linkDirectionalParticleWidth={2}
        width={400}
        height={400}
        showNavInfo={false}
        nodeLabel={"name"}
        // nodeThreeObject={node => {
        //   // Create node sphere
        //   const material = new THREE.MeshBasicMaterial({ color: node.color });
        //   const geometry = new THREE.SphereGeometry(2); // Adjust size here
        //   const sphere = new THREE.Mesh(geometry, material);

        //   // Create node label
        //   const sprite = new SpriteText(node.name);
        //   sprite.color = node.color || 'red'; // Change the label color here
        //   sprite.textHeight = 8;
        //   sprite.position.y = 2; // Adjust position to avoid overlapping with the sphere

        //   // Create a group to hold both the sphere and the label
        //   const group = new THREE.Group();
        //   group.add(sphere);
        //   group.add(sprite);

        //   return group;
        // }}


        nodeThreeObject={node => {
          const material = new THREE.MeshBasicMaterial({ color: node.color });
          const geometry = new THREE.SphereGeometry(20); // Adjust size here
          return new THREE.Mesh(geometry, material);
        }}
        // linkMaterial={link => {
        //   return new THREE.LineBasicMaterial({
        //     color: link.color || 'lightgreen',
        //     linewidth: 2 // Adjust link width here
        //   });
        // }}
        dagLevelDistance={null}
        enableNodeDrag={false} // Disables node dragging
        backgroundColor="black"  // Set background color to white
        cooldownTicks={0} // Stop simulation immediately
        onEngineTick={() => null} // Override physics engine ticks
        onEngineStop={() => console.log('Simulation stopped')} // Notification on simulation stop
        // nodeLabel={() => ''} // Override default tooltip
      />         
    </div>
  );
};

export default BranchSeedDay10ForceGraph3D;



