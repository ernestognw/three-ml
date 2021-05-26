import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useVisualization } from '@providers/visualization';
import Box from './box';

const Home = () => {
  const {
    classes,
    // Extract more data from here
  } = useVisualization();

  // TODO: Use provider values to manipulate visualizaiton

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {new Array(classes).fill().map((_, index) => (
        <Box key={index} position={[index - 3 + index * 0.2, 0, 0]} />
      ))}
    </Canvas>
  );
};

export default Home;
