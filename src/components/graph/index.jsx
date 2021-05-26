import React from 'react';
import { Scatter } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const distinct = (value, index, self) => {
  return self.indexOf(value) === index;
};

const Graph = ({ dataset, onClick = null, selectedPoint = null }) => {
  if (!dataset) {
    return <></>;
  }
  // eslint-disable-next-line camelcase
  const { X_train, y_train } = dataset;

  // TODO: Add as many colors as there can be classes
  const colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];

  const points = X_train.map((point) => ({
    x: point[0],
    y: point[1],
  }));

  let datasets = [];
  if (selectedPoint) {
    datasets = y_train.filter(distinct).map((classIndex) => ({
      label: `Class #${classIndex}`,
      data: points.filter((_element, index) => y_train[index] === classIndex),
      backgroundColor: colors[classIndex],
      pointBackgroundColor: colors[classIndex],
    }));
    datasets.push({
      label: 'Selected point',
      data: [selectedPoint],
      backgroundColor: '#000',
      pointBackgroundColor: '#000',
    });
  } else {
    datasets = y_train.filter(distinct).map((classIndex) => ({
      label: `Class #${classIndex}`,
      data: points.filter((_element, index) => y_train[index] === classIndex),
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
  selectedPoint: PropTypes.any,
  onClick: PropTypes.any,
};

export default Graph;
