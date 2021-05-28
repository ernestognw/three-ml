import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Color, SphereGeometry, Vector3, BufferGeometry } from 'three';
import Axon from '../axon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

extend({ OrbitControls });

const EPSILON = 10e-9;

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

function IONeuron(props) {
  const mesh = useRef();

  return (
    <mesh {...props} ref={mesh} scale={1}>
      <sphereGeometry args={[1]} />
      <meshStandardMaterial color="white" emissive={new Color(1, 1, 1)} emissiveIntensity={10} />
    </mesh>
  );
}

function Neuron(props) {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!props.isTrained) {
      mesh.current.rotation.y = Math.PI / 2;
      if (mesh.current.material.emissiveIntensity > 1) {
        mesh.current.material.emissiveIntensity -= 1;
      }
      mesh.current.material.emissiveIntensity += 0.005;
    }
  });

  return (
    <mesh {...props} ref={mesh} scale={0.75}>
      <bufferGeometry attach="geometry" {...props.neuronGeom.clone()} />
      <meshStandardMaterial
        color="white"
        emissive={new Color(1, 1, 1)}
        emissiveIntensity={props.intensity * 10}
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

function computeIntensities(results) {
  let res = results.map((row) => {
    return Math.max(...row);
  });
  let maxVal = Math.max(...res);
  let ans = [];
  for (let i = 0; i < results.length; i++) {
    let curAns = [];
    for (let j = 0; j < results[0].length; j++) {
      curAns.push(Math.abs(maxVal, 0) < EPSILON ? 1 : results[i][j] / maxVal);
    }
    ans.push(curAns);
  }
  return ans;
}

function ComposedLayer({ z, neurons, results, neuronGeom, isTrained, isIO }) {
  const NON_INFERENCE_INTENSITY = 0;
  const positions = computeLayerPositions(z, neurons);
  const intensities = results ? computeIntensities(results) : null;
  const neuronsUI = positions.map((position, idx) => {
    if (isIO) {
      return (
        <Neuron
          position={position}
          key={idx}
          intensity={intensities ? intensities[0][idx] : NON_INFERENCE_INTENSITY}
          neuronGeom={neuronGeom}
          isTrained={isTrained}
        />
      );
    } else {
      return <IONeuron position={position} />;
    }
  });
  return neuronsUI;
}

function getAxonThreshold(W) {
  const PROPORTION_SHOWN = 0.1;
  const weights = [];
  for (let i = 0; i < W.length; i++) {
    for (let j = 0; j < W[0].length; j++) {
      weights.push(W[i][j]);
    }
  }
  weights.sort();

  const thresholdIdx = Math.floor(weights.length * (1 - PROPORTION_SHOWN));
  const ans = thresholdIdx < weights.length ? weights[thresholdIdx] : weights[weights.length - 1];
  return ans - EPSILON;
}

async function loadNeuronGeometry() {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      '/Neuron.glb',
      (gltf) => {
        resolve(gltf.scene.children[2].geometry);
      },
      undefined,
      reject
    );
  });
}

function NeuralNet({ layers: layersProp, classes, NNWeights, results, isTrained }) {
  const [neuronGeom, setNeuronGeom] = useState(new BufferGeometry());

  // load the neuron geometry
  useEffect(() => {
    loadNeuronGeometry()
      .then((res) => {
        setNeuronGeom(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // VIEWPORT ATTEMPT
  // useFrame(({gl, scene, camera}) => {
  //   gl.autoClear = true;
  //   gl.setViewport(150, 150, window.innerWidth / 2, window.innerHeight / 2);
  //   gl.setScissor(0, 0, window.innerWidth / 2, window.innerHeight / 2);
  //   gl.render(scene, camera);
  //   gl.autoClear = false;
  //   gl.clearDepth();
  // })

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
    return (
      <ComposedLayer
        z={zArr[idx]}
        neurons={neurons}
        key={idx}
        results={results ? results[idx] : null}
        neuronGeom={neuronGeom}
        isTrained={isTrained}
        isIO={idx > 0 && idx < layers.length - 1}
      />
    );
  });

  // COMPUTE THE AXONS
  let axons = [];
  if (NNWeights && isTrained) {
    for (let layerIdx = 0; layerIdx < neuronsPositions.length - 1; layerIdx++) {
      const threshold = getAxonThreshold(NNWeights[layerIdx]['weight']);
      for (let i = 0; i < neuronsPositions[layerIdx].length; i++) {
        for (let j = 0; j < neuronsPositions[layerIdx + 1].length; j++) {
          const start = neuronsPositions[layerIdx][i];
          const end = neuronsPositions[layerIdx + 1][j];
          const curWeight = NNWeights[layerIdx]['weight'][i][j];
          if (curWeight >= threshold) {
            const curAxon = <Axon start={start} end={end} />;
            axons.push(curAxon);
          }
        }
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
