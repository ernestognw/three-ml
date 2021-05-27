import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useVisualization } from '@providers/visualization';
import NeuralNet from './neuron';

const Home = ({ NNWeights, results }) => {
  const {
    classes,
    layers,
    // Extract more data from here
  } = useVisualization();

  // TODO: Use provider values to manipulate visualizaiton

  return (
    <Canvas camera={{ position: [0, 0, 50] }}>
      <NeuralNet layers={layers} classes={classes} NNWeights={NNWeights} results={results} />
    </Canvas>
  );
};

export default Home;
