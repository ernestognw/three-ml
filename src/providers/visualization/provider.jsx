import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { datasetApi } from '../../clients/axios';
const VisualizationContext = createContext({});

const VisualizationProvider = ({ children }) => {
  const [dataset, setDataset] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [classes, setClasses] = useState(2);
  const [samplesPerClass, setSamplesPerClass] = useState(100);
  const [layers, setLayers] = useState([5, 4, 3]);
  const [batchSize, setBatchSize] = useState(4);
  const [epoch, setEpoch] = useState(1);
  const [trainProportion, setTrainProportion] = useState(0.75);
  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });
  const [classification, setClassification] = useState(null);
  const [fetchingDataset, setFetchingDataset] = useState(false);
  const [training, setTraining] = useState(null);
  const [trained, setTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [loss, setLoss] = useState(null);
  const [weights, setWeights] = useState(null);

  const fetchDataset = async () => {
    setFetchingDataset(true);
    try {
      const { data } = await datasetApi.get(
        `/dataset?dataset_name=${dataset}&classes=${classes}&samples_per_class=${samplesPerClass}`
      );
      setDatasetData(data);
      setFetchingDataset(false);
    } catch (e) {
      console.error(`Error while trying to get the dataset: ${e}`);
      setFetchingDataset(false);
    }
  };

  useEffect(() => {
    if (dataset) {
      fetchDataset();
    }
  }, [classes, dataset, samplesPerClass]);

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
        fetchingDataset,
        setFetchingDataset,
        training,
        setTraining,
        trained,
        setTrained,
        accuracy,
        setAccuracy,
        loss,
        setLoss,
        weights,
        setWeights,
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
