import axios from 'axios';

export const datasetApi = axios.create({
  baseURL: process.env.REACT_APP_DATASET_API_URL,
  timeout: 7500,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainApi = axios.create({
  baseURL: process.env.REACT_APP_TRAIN_API_URL,
  timeout: 7500,
  headers: {
    'Content-Type': 'application/json',
  },
});
