import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const VisualizationContext = createContext({});

const VisualizationProvider = ({ children }) => {
  const [dataset, setDataset] = useState('A');
  const [classes, setClasses] = useState(0);
  const [samplesPerClass, setSamplesPerClass] = useState(0);
  const [layers, setLayers] = useState(0);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(0);

  return (
    <VisualizationContext.Provider
      value={{
        dataset,
        setDataset,
        classes,
        setClasses,
        samplesPerClass,
        setSamplesPerClass,
        layers,
        setLayers,
        neuronsPerLayer,
        setNeuronsPerLayer,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
};

VisualizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { VisualizationContext };
export default VisualizationProvider;
