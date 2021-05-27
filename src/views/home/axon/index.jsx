import * as THREE from 'three';
import React, { Fragment, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

function Line({ start, end }) {
  let geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([...start, ...end]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.MeshBasicMaterial({ color: 'black' });

  return (
    <Fragment>
      <line>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshStandardMaterial
          color="black"
          emissive={new THREE.Color(0, 0, 1)}
          emissiveIntensity={10}
        />
      </line>
    </Fragment>
  );
}

function Axon({ start, end }) {
  return <Line start={start} end={end} />;
}

Axon.propTypes = {
  start: PropTypes.any.isRequired,
  end: PropTypes.any.isRequired,
};

export default Axon;
