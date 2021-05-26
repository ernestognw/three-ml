import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useVisualization } from '@providers/visualization';
import Box from './box';

const Home = () => {
  const { dataset, classes, samplesPerClass } = useVisualization();

  // TODO: Use provider values to manipulate visualizaiton

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default Home;
