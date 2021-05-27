import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Color, Vector3 } from 'three';
import Axon from '../axon';

extend({ OrbitControls });

// function Box(props) {
//   // This reference will give us direct access to the THREE.Mesh object
//   const mesh = useRef();
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   );
// }

function Neuron(props) {
  const mesh = useRef();

  const curEmmisiveIntensity = Math.random() * 10;

  return (
    <mesh {...props} ref={mesh} scale={1}>
      <sphereGeometry args={[1]} />
      <meshStandardMaterial
        color="white"
        emissive={new Color(0, 0, curEmmisiveIntensity / 10)}
        emissiveIntensity={curEmmisiveIntensity}
      />
    </mesh>
  );
}

function makeValidAngles(angles) {
  const ans = angles.map((angle) => {
    let newAngle = angle;

    if (newAngle >= 0) {
      while (newAngle >= 2 * Math.PI) {
        newAngle -= 2 * Math.PI;
      }
      return newAngle;
    }

    while (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }
    return newAngle;
  });
  return ans;
}

function computeAnglesFromStartingAngle(neurons, angle) {
  const ans = [angle];
  const totalCircle = 2 * Math.PI;
  const inc = totalCircle / neurons;
  let curAngle = angle;
  for (let i = 0; i < neurons - 1; i += 1) {
    curAngle += inc;
    ans.push(curAngle);
  }
  return makeValidAngles(ans);
}

function getCircleArrangementPositions(neurons, radius, angle) {
  const angles = computeAnglesFromStartingAngle(neurons, angle);
  const ans = angles.map((a) => {
    return [Math.sin(a) * radius, Math.cos(a) * radius];
  });
  return ans;
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      // maxAzimuthAngle={Math.PI / 4}
      // maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={0}
      minDistance={50}
      maxDistance={100}
    />
  );
};

function computeLayerPositions(z, neurons) {
  const angle = 0;

  const neuronsArr = [];

  if (neurons === 1) {
    neuronsArr.push(1);
  } else if (neurons <= 6) {
    neuronsArr.push(1);
    neuronsArr.push(neurons - 1);
  } else if (neurons <= 16) {
    let curLeft = neurons;
    neuronsArr.push(1);
    curLeft -= 1;
    neuronsArr.push(Math.floor(curLeft / 3));
    curLeft -= Math.floor(curLeft / 3);
    neuronsArr.push(curLeft);
  } else if (neurons <= 31) {
    let curLeft = neurons;
    neuronsArr.push(1);
    curLeft -= 1;
    neuronsArr.push(Math.floor(curLeft / 6));
    curLeft -= Math.floor(curLeft / 6);
    neuronsArr.push(Math.floor(curLeft / 3));
    curLeft -= Math.floor(curLeft / 3);
    neuronsArr.push(curLeft);
  } else if (neurons <= 51) {
    let curLeft = neurons;
    neuronsArr.push(1);
    curLeft -= 1;
    neuronsArr.push(Math.floor(curLeft / 10));
    curLeft -= Math.floor(curLeft / 10);
    neuronsArr.push(Math.floor(curLeft / 5));
    curLeft -= Math.floor(curLeft / 5);
    neuronsArr.push(Math.floor(curLeft / (10 / 3)));
    curLeft -= Math.floor(curLeft / (10 / 3));
    neuronsArr.push(curLeft);
  }

  const radius = neuronsArr.map((_, idx) => {
    return idx * 2.5;
  });

  let totalPositions = [];
  for (let idx = 0; idx < radius.length; idx += 1) {
    totalPositions = [
      ...totalPositions,
      ...getCircleArrangementPositions(neuronsArr[idx], radius[idx], angle),
    ];
  }
  const positions = totalPositions.map((position) => {
    return [...position, z];
  });

  return positions;
}

function ComposedLayer({ z, neurons }) {
  const positions = computeLayerPositions(z, neurons);
  const neuronsUI = positions.map((position, idx) => {
    return <Neuron position={position} key={idx} />;
  });
  return neuronsUI;
}

function NeuralNet({ layers: layersProp, classes }) {
  const layers = [2, ...layersProp, classes];

  let start;
  if (layers.length % 2 === 0) start = -(layers.length / 2) * 15 + 7.5;
  else start = (-(layers.length - 1) / 2) * 15;
  const zArr = layers.map((_, idx) => {
    return start + idx * 15.0;
  });

  let neuronsPositions = [];

  const layersUI = layers.map((neurons, idx) => {
    neuronsPositions.push(computeLayerPositions(zArr[idx], neurons));
    return <ComposedLayer z={zArr[idx]} neurons={neurons} key={idx} />;
  });

  // COMPUTE THE AXONS
  let axons = [];
  for (let layerIdx = 0; layerIdx < neuronsPositions.length - 1; layerIdx++) {
    for (let i = 0; i < neuronsPositions[layerIdx].length; i++) {
      for (let j = 0; j < neuronsPositions[layerIdx + 1].length; j++) {
        const start = neuronsPositions[layerIdx][i];
        const end = neuronsPositions[layerIdx + 1][j];
        const curAxon = <Axon start={start} end={end} />;

        // Instead of this, we would check if weights[layerIdx][i][j] is amongst the highest
        // 10% values from weights[layerIdx]
        if (Math.random() < 0.1) axons.push(curAxon);
      }
    }
  }

  return (
    <>
      <CameraControls />
      {layersUI}
      {axons}
    </>
  );
}

NeuralNet.propTypes = {
  layers: PropTypes.any.isRequired,
  classes: PropTypes.any.isRequired,
};

export default NeuralNet;
