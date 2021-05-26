import React from 'react';
import { Scatter } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import Text from 'antd/es/typography/Text';
import { Spin } from 'antd';

const distinct = (value, index, self) => {
  return self.indexOf(value) === index;
};

const Graph = ({ fetchingDataset, dataset, onClick = null, selectedPoint = null }) => {
  if (!dataset && !fetchingDataset) {
    return (
      <Text strong>La visualización de tus datos se verá acá en cuanto selecciones un dataset</Text>
    );
  }

  if (fetchingDataset) {
    return <Spin />;
  }
  // eslint-disable-next-line camelcase
  const { X, y } = dataset;

  // TODO: Add as many colors as there can be classes
  const colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];

  const points = X.map((point) => ({
    x: point[0],
    y: point[1],
  }));

  let datasets = [];
  if (selectedPoint) {
    datasets = y.filter(distinct).map((classIndex) => ({
      label: `Clase #${classIndex + 1}`,
      data: points.filter((_element, index) => y[index] === classIndex),
      backgroundColor: colors[classIndex],
      pointBackgroundColor: colors[classIndex],
    }));
    datasets.push({
      label: 'Punto a evaluar',
      data: [selectedPoint],
      backgroundColor: '#000',
      pointBackgroundColor: '#000',
    });
  } else {
    datasets = y.filter(distinct).map((classIndex) => ({
      label: `Clase #${classIndex + 1}`,
      data: points.filter((_element, index) => y[index] === classIndex),
      backgroundColor: colors[classIndex],
      pointBackgroundColor: colors[classIndex],
    }));
  }

  const data = {
    datasets,
  };
  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
    },
    onClick,
  };

  return <Scatter data={data} options={options} />;
};

Graph.propTypes = {
  dataset: PropTypes.any.isRequired,
  fetchingDataset: PropTypes.bool.isRequired,
  selectedPoint: PropTypes.any,
  onClick: PropTypes.any,
};

export default Graph;
