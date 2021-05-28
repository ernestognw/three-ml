import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useVisualization } from '@providers/visualization';
import NeuralNet from './neuron';

const Home = ({ NNWeights, results }) => {
  const {
    classes,
    layers,
    trained,
    // Extract more data from here
  } = useVisualization();

  // TODO: Use provider values to manipulate visualizaiton
  const isTrained = !(NNWeights == null) && trained;

  return (
    <>
      <Canvas camera={{ position: [0, 0, 50] }}>
        <NeuralNet
          layers={layers}
          classes={classes}
          NNWeights={NNWeights}
          results={results}
          isTrained={isTrained}
        />
      </Canvas>
    </>
  );
};

export default Home;
