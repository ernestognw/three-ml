import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useVisualization } from '@providers/visualization';
import NeuralNet from './neuron';
import ViewPort from '../../layouts/main/viewport';

const Home = ({ NNWeights, results }) => {
  const {
    classes,
    layers,
    trained,
    // Extract more data from here
  } = useVisualization();

  // TODO: Use provider values to manipulate visualizaiton
  const isTrained = !(NNWeights == null) && trained;

  const neuralNet = (
    <NeuralNet
      layers={layers}
      classes={classes}
      NNWeights={NNWeights}
      results={results}
      isTrained={isTrained}
    />
  );

  return (
    <>
      <Canvas camera={{ position: [-50, 25, 50] }}>{neuralNet}</Canvas>
    </>
  );
};

export default Home;
