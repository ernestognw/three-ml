import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const VisualizationContext = createContext({});

const VisualizationProvider = ({ children }) => {
  const [dataset, setDataset] = useState('A');
  const [datasetData, setDatasetData] = useState({
    X_train: [
      [-0.3349942605617269, 1.816462801117956],
      [2.2579886440171686, -1.5027949883072116],
      [2.2030835436431992, -1.0401132077965696],
      [1.6611160376034222, -0.6416198954592722],
      [1.5600701499552525, 0.19939429495359395],
      [0.8013908206072452, 0.5565393290433246],
      [3.64863617703512, -2.103369251257378],
      [4.761993504611729, -3.044202577543386],
      [1.7487192090475743, -0.49520154133535726],
      [0.9241727076298839, 0.7482058285069899],
      [0.9075870378232225, 0.025205232936732862],
      [3.089861845467868, -0.6790531450689552],
      [4.248893333591032, -2.8881530045278248],
      [0.3284305247368678, 1.3230476170866263],
    ],
    y_train: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  });
  const [classes, setClasses] = useState(2);
  const [samplesPerClass, setSamplesPerClass] = useState(0);
  const [layers, setLayers] = useState([]);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(0);
  const [batchSize, setBatchSize] = useState(10);
  const [epoch, setEpoch] = useState(1);
  const [trainProportion, setTrainProportion] = useState(0.75);
  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });
  const [classification, setClassification] = useState(null);

  return (
    <VisualizationContext.Provider
      value={{
        dataset,
        setDataset,
        datasetData,
        setDatasetData,
        classes,
        setClasses,
        samplesPerClass,
        setSamplesPerClass,
        layers,
        setLayers,
        neuronsPerLayer,
        setNeuronsPerLayer,
        batchSize,
        setBatchSize,
        epoch,
        setEpoch,
        trainProportion,
        setTrainProportion,
        selectedPoint,
        setSelectedPoint,
        classification,
        setClassification,
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
